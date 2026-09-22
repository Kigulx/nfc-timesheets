package io.github.qwadratic.nfctimesheets.net

import android.content.Context
import io.github.qwadratic.nfctimesheets.BuildConfig

fun apiBaseUrl(context: Context): String = "https://${BuildConfig.API_HOST}"
