package android.nfc.tech

import android.nfc.Tag

class Record(val uri: String) { fun toUri(): String = uri }
class Message(uri: String) { val records = listOf(Record(uri)) }
class Ndef(private val tag: Tag) {
    fun connect() {}
    fun close() {}
    val ndefMessage get() = tag.uri?.let(::Message)
    val cachedNdefMessage get() = ndefMessage
    companion object { fun get(tag: Tag): Ndef? = if (tag.uri == null) null else Ndef(tag) }
}
