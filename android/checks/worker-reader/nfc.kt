package android.nfc

import android.app.Activity

class Tag(val id: ByteArray = byteArrayOf(1), val uri: String? = null, val rawUri: String? = null)
class NfcAdapter {
    var isEnabled = true
    var callback: ((Tag) -> Unit)? = null
    fun enableReaderMode(activity: Activity, read: (Tag) -> Unit, flags: Int, options: Any?) { callback = read }
    fun disableReaderMode(activity: Activity) { callback = null }
    companion object {
        val instance = NfcAdapter()
        fun getDefaultAdapter(activity: Activity): NfcAdapter = instance
        const val FLAG_READER_NFC_A = 1
        const val FLAG_READER_NFC_B = 2
        const val FLAG_READER_NFC_F = 4
        const val FLAG_READER_NFC_V = 8
    }
}
