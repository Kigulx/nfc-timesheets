package io.github.qwadratic.nfctimesheets.net

import android.content.Context
import io.github.qwadratic.nfctimesheets.BuildConfig

/** adb run-as can opt a DEBUG install into the isolated local API; release has no override. */
fun apiBaseUrl(context: Context): String {
    val override = context.getSharedPreferences("debug_api", Context.MODE_PRIVATE).getString("base", "")
    return if (override == "http://127.0.0.1:8082") override else "https://${BuildConfig.API_HOST}"
}
