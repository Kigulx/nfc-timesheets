package io.github.qwadratic.nfctimesheets

import android.app.Activity
import android.app.LocaleManager
import android.content.Context
import android.content.res.Configuration
import android.os.Build
import android.os.LocaleList
import androidx.activity.ComponentActivity
import java.util.Locale

/** Android 13 owns app locales; older phones use the same preference for UI and reminders. */
object AppLanguage {
    fun selected(context: Context): String = if (Build.VERSION.SDK_INT >= 33) {
        context.getSystemService(LocaleManager::class.java).applicationLocales.toLanguageTags()
            .substringBefore(',').substringBefore('-')
    } else {
        context.getSharedPreferences("app_language", Context.MODE_PRIVATE).getString("language", "") ?: ""
    }

    fun set(activity: Activity, language: String) {
        require(language in listOf("", "de", "en"))
        if (Build.VERSION.SDK_INT >= 33) {
            activity.getSystemService(LocaleManager::class.java).applicationLocales =
                LocaleList.forLanguageTags(language)
        } else {
            activity.getSharedPreferences("app_language", Context.MODE_PRIVATE)
                .edit().putString("language", language).apply()
            activity.recreate()
        }
    }

    @Suppress("DEPRECATION")
    fun locale(context: Context): Locale = wrap(context).resources.configuration.let {
        if (Build.VERSION.SDK_INT >= 24) it.locales[0] else it.locale
    }

    fun wrap(context: Context): Context {
        if (Build.VERSION.SDK_INT >= 33) return context
        val language = selected(context)
        if (language.isEmpty()) return context
        val configuration = Configuration(context.resources.configuration)
        configuration.setLocale(Locale.forLanguageTag(language))
        return context.createConfigurationContext(configuration)
    }
}

abstract class LocalizedActivity : ComponentActivity() {
    override fun attachBaseContext(newBase: Context) {
        super.attachBaseContext(AppLanguage.wrap(newBase))
    }
}
