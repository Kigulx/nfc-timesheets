package io.github.qwadratic.nfctimesheets

import io.github.qwadratic.nfctimesheets.core.TagLink

class TimeSheetsApplication {
    val tagLink = TagLink("tags.example.test")
    val store = Store()
}
class Store { fun zones(): List<String> = emptyList() }
