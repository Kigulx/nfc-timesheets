package io.github.qwadratic.nfctimesheets.nfc

import android.app.Activity
import android.nfc.NfcAdapter
import android.nfc.Tag
import android.nfc.tech.Ndef
import io.github.qwadratic.nfctimesheets.TimeSheetsApplication
import io.github.qwadratic.nfctimesheets.core.Zones

/** Foreground worker scanning never writes a card or enters an operator flow. */
class WorkerTagReader(private val activity: Activity, private val onRead: (String?) -> Unit) {
    private val adapter = NfcAdapter.getDefaultAdapter(activity)
    @Volatile private var enabled = false
    @Volatile private var generation = 0

    fun setEnabled(value: Boolean) {
        generation++
        enabled = value
        val nfc = adapter ?: return
        if (!value || !nfc.isEnabled) {
            nfc.disableReaderMode(activity)
            return
        }
        nfc.enableReaderMode(activity, ::read, NfcAdapter.FLAG_READER_NFC_A or
            NfcAdapter.FLAG_READER_NFC_B or NfcAdapter.FLAG_READER_NFC_F or
            NfcAdapter.FLAG_READER_NFC_V, null)
    }

    private fun read(tag: Tag) {
        if (!enabled) return
        val readGeneration = generation
        val app = activity.application as TimeSheetsApplication
        val uri = readTagUri(tag)
        val uid = tag.id.joinToString(":") { "%02X".format(it) }
        val id = app.tagLink.locationId(uri)
            ?: Zones.zonePlaceIdForSerial(uid, app.store.zones())
            ?: KnownTags.locationIdFor(uid)
        activity.runOnUiThread { if (enabled && generation == readGeneration) onRead(id) }
    }
}

/** Shared with manual scanning, including the raw-page recovery used by operator scans. */
internal fun readTagUri(tag: Tag): String? = runCatching {
    val ndef = Ndef.get(tag) ?: return@runCatching null
    try {
        ndef.connect()
        (ndef.ndefMessage ?: ndef.cachedNdefMessage)?.records
            ?.firstNotNullOfOrNull { record -> runCatching { record.toUri()?.toString() }.getOrNull() }
    } finally {
        runCatching { ndef.close() }
    }
}.getOrNull() ?: RawTagIo.uri(tag)
