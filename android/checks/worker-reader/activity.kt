package android.app

class Activity(val application: Any) {
    val callbacks = mutableListOf<() -> Unit>()
    fun runOnUiThread(action: () -> Unit) { callbacks += action }
    fun drain() { callbacks.toList().also { callbacks.clear() }.forEach { it() } }
}
