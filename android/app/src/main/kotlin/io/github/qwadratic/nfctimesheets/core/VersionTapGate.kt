package io.github.qwadratic.nfctimesheets.core

/** Five version-row taps reveal the pre-auth operator door, then start a fresh sequence. */
object VersionTapGate {
    const val REQUIRED_TAPS = 5

    data class Result(val tapCount: Int, val openOperator: Boolean)

    fun advance(currentTapCount: Int): Result {
        require(currentTapCount in 0 until REQUIRED_TAPS)
        val nextTapCount = currentTapCount + 1
        return if (nextTapCount == REQUIRED_TAPS) {
            Result(tapCount = 0, openOperator = true)
        } else {
            Result(tapCount = nextTapCount, openOperator = false)
        }
    }
}
