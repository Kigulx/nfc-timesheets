package io.github.qwadratic.nfctimesheets.nfc

import android.nfc.Tag

// RawTagIo and roster matching have their own real-implementation checks.
object RawTagIo { fun uri(tag: Tag): String? = tag.rawUri }
object KnownTags { fun locationIdFor(serial: String): String? = null }
