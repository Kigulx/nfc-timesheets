package io.github.qwadratic.nfctimesheets.ui

import android.app.Activity
import android.content.Context
import android.content.ContextWrapper
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.selection.selectableGroup
import androidx.compose.material3.FilterChip
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.unit.dp
import io.github.qwadratic.nfctimesheets.AppLanguage
import io.github.qwadratic.nfctimesheets.R

@Composable
fun LanguagePicker() {
    val context = LocalContext.current
    val current = AppLanguage.selected(context)
    Column {
        Text(stringResource(R.string.language_title), style = MaterialTheme.typography.labelLarge)
        FlowRow(Modifier.selectableGroup(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            listOf("de" to R.string.language_de, "en" to R.string.language_en, "" to R.string.language_system)
                .forEach { (language, label) ->
                    FilterChip(
                        selected = current == language,
                        onClick = { context.activity()?.let { AppLanguage.set(it, language) } },
                        label = { Text(stringResource(label)) },
                    )
                }
        }
    }
}

private fun Context.activity(): Activity? = when (this) {
    is Activity -> this
    is ContextWrapper -> baseContext.activity()
    else -> null
}
