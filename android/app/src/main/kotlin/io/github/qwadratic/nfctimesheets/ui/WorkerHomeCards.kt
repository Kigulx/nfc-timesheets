package io.github.qwadratic.nfctimesheets.ui

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.semantics.heading
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.semantics.clearAndSetSemantics
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.foundation.Canvas
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import io.github.qwadratic.nfctimesheets.R
import io.github.qwadratic.nfctimesheets.nfc.NfcReadiness
import io.github.qwadratic.nfctimesheets.AppLanguage
import androidx.compose.ui.platform.LocalContext
import androidx.compose.runtime.produceState
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.foundation.shape.CircleShape
import kotlinx.coroutines.delay
import java.time.LocalDate
import java.time.format.DateTimeFormatter

@Composable
internal fun WorkerDayHeading() {
    val today by produceState(LocalDate.now()) {
        while (true) { value = LocalDate.now(); delay(60_000) }
    }
    val locale = AppLanguage.locale(LocalContext.current)
    Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
        Text(today.format(DateTimeFormatter.ofPattern("EEEE · d MMMM", locale)),
            style = MaterialTheme.typography.labelMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)
        Text(stringResource(R.string.worker_day_title), style = MaterialTheme.typography.headlineSmall,
            modifier = Modifier.semantics { heading() })
    }
}

@Composable
internal fun WorkerIdentity(name: String) {
    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(14.dp)) {
        Surface(shape = CircleShape, color = MaterialTheme.colorScheme.surfaceContainerHigh) {
            Box(Modifier.size(50.dp).clearAndSetSemantics { }, contentAlignment = Alignment.Center) {
                Text(name.trim().split(Regex("\\s+")).take(2).mapNotNull { it.firstOrNull() }.joinToString(""),
                    style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
            }
        }
        Text(name, style = MaterialTheme.typography.titleLarge, modifier = Modifier.weight(1f))
    }
}

@Composable
internal fun WorkerStartCard(readiness: NfcReadiness, onScan: () -> Unit, onManual: () -> Unit) {
    val manualOnly = readiness == NfcReadiness.UNSUPPORTED
    WorkerCard(Modifier.fillMaxWidth()) {
        Column(Modifier.padding(horizontal = 22.dp, vertical = 16.dp), horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(10.dp)) {
            WorkerIllustration(WorkerPicture.ENTRANCE)
            Text(stringResource(if (manualOnly) R.string.worker_start_manual_title else R.string.worker_start_title),
                style = MaterialTheme.typography.titleLarge, textAlign = TextAlign.Center)
            Text(stringResource(if (manualOnly) R.string.worker_start_manual_hint else R.string.log_hint_start),
                style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.onSurfaceVariant,
                textAlign = TextAlign.Center)
            Button(
                onClick = if (manualOnly) onManual else onScan,
                colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.inverseSurface,
                    contentColor = MaterialTheme.colorScheme.inverseOnSurface),
                modifier = Modifier.fillMaxWidth().heightIn(min = 54.dp),
                shape = RoundedCornerShape(18.dp),
            ) { Text(stringResource(if (manualOnly) R.string.manual_start_open else R.string.scan_open)) }
            if (!manualOnly) {
                TextButton(onClick = onManual, modifier = Modifier.heightIn(min = 48.dp)) {
                    Text(stringResource(R.string.manual_start_open), color = MaterialTheme.colorScheme.onSurfaceVariant)
                }
            }
        }
    }
}

@Composable
internal fun ScheduleCard(state: ScheduleState, retry: () -> Unit) {
    var expanded by remember(state) { mutableStateOf(false) }
    WorkerCard(Modifier.fillMaxWidth()) {
        Column(
            Modifier.padding(20.dp),
            verticalArrangement = Arrangement.spacedBy(10.dp),
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text(stringResource(R.string.schedule_title), style = MaterialTheme.typography.titleMedium,
                    modifier = Modifier.weight(1f).semantics { heading() })
                ScheduleRefresh(retry)
            }
            Text(stringResource(R.string.worker_schedule_note), style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant)
            when (state) {
                ScheduleState.Loading -> Text(stringResource(R.string.schedule_loading))
                is ScheduleState.Failed -> {
                    Text(stringResource(if (state.offline) R.string.schedule_offline else R.string.schedule_error))
                    TextButton(onClick = retry) { Text(stringResource(R.string.schedule_retry), color = MaterialTheme.colorScheme.onSurface) }
                }
                is ScheduleState.Loaded -> {
                    if (state.assignments.isEmpty()) {
                        Text(stringResource(R.string.schedule_empty))
                    } else {
                        (if (expanded) state.assignments else state.assignments.take(1)).forEach { assignment ->
                            Column(verticalArrangement = Arrangement.spacedBy(2.dp)) {
                                Text(assignment.locationName, style = MaterialTheme.typography.titleSmall)
                                Text(
                                    if (viennaDate(assignment.startsAt) == viennaDate(assignment.endsAt)) {
                                        stringResource(R.string.schedule_same_day, viennaDate(assignment.startsAt),
                                            viennaTime(assignment.startsAt), viennaTime(assignment.endsAt))
                                    } else {
                                        stringResource(R.string.schedule_when, viennaDate(assignment.startsAt), viennaTime(assignment.startsAt),
                                            viennaDate(assignment.endsAt), viennaTime(assignment.endsAt))
                                    }, style = MaterialTheme.typography.bodyMedium,
                                )
                                if (assignment.note.isNotBlank()) Text(assignment.note,
                                    style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                            }
                            if (expanded) HorizontalDivider()
                        }
                        if (state.assignments.size > 1) {
                            TextButton(onClick = { expanded = !expanded }) {
                                Text(stringResource(if (expanded) R.string.schedule_less else R.string.schedule_more), color = MaterialTheme.colorScheme.onSurface)
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun ScheduleRefresh(retry: () -> Unit) {
    val description = stringResource(R.string.schedule_refresh)
    val ink = MaterialTheme.colorScheme.onSurfaceVariant
    IconButton(onClick = retry, modifier = Modifier.semantics { contentDescription = description }) {
        Canvas(Modifier.size(22.dp)) {
            drawArc(ink, 35f, 290f, false, Offset(size.width*.15f, size.height*.15f),
                Size(size.width*.7f, size.height*.7f), style=Stroke(2.dp.toPx(), cap=StrokeCap.Round))
            drawLine(ink, Offset(size.width*.8f,size.height*.12f), Offset(size.width*.8f,size.height*.4f),2.dp.toPx(),StrokeCap.Round)
            drawLine(ink, Offset(size.width*.8f,size.height*.4f), Offset(size.width*.54f,size.height*.35f),2.dp.toPx(),StrokeCap.Round)
        }
    }
}

