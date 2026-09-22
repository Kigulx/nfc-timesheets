package io.github.qwadratic.nfctimesheets.checks

import android.app.Activity
import android.nfc.NfcAdapter
import android.nfc.Tag
import io.github.qwadratic.nfctimesheets.TimeSheetsApplication
import io.github.qwadratic.nfctimesheets.nfc.WorkerTagReader

fun main() {
    val app = TimeSheetsApplication()
    val activity = Activity(app)
    val reads = mutableListOf<String?>()
    val reader = WorkerTagReader(activity, reads::add)
    val nfc = NfcAdapter.instance
    val id = "33900000-0000-4000-8000-000000000002"
    val uri = app.tagLink.uriFor(id).toString()
    check(nfc.callback == null)
    reader.setEnabled(true)
    nfc.callback!!(Tag(uri = uri))
    activity.drain()
    check(reads == listOf(id)) { "foreground card must reach the worker without manual scan" }

    nfc.callback!!(Tag(rawUri = uri))
    activity.drain()
    check(reads == listOf(id, id)) { "raw fallback must match ordinary NDEF reading" }

    nfc.callback!!(Tag(uri = "https://foreign.example/t?l=$id"))
    activity.drain()
    check(reads.last() == null) { "foreign hosts must never become a worker clock-in" }

    val previousCallback = nfc.callback!!
    previousCallback(Tag(uri = uri))
    reader.setEnabled(false)
    check(nfc.callback == null) { "operator/background transition must disable worker radio" }
    activity.drain()
    check(reads.size == 3) { "an in-flight callback must not survive disarming" }

    reader.setEnabled(true)
    nfc.callback!!(Tag(uri = uri))
    reader.setEnabled(false)
    reader.setEnabled(true)
    activity.drain()
    check(reads.size == 3) { "an old read must not land in a newly resumed worker screen" }
    nfc.callback!!(Tag(uri = uri))
    activity.drain()
    check(reads.last() == id && reads.size == 4)
    nfc.isEnabled = false
    reader.setEnabled(true)
    check(nfc.callback == null) { "disabled NFC must not arm a reader" }
    println("worker-reader-check: OK (automatic read, raw fallback, host rejection, pause and resume races)")
}
