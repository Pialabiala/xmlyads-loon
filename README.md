# xmlyads-loon

Loon plugin for removing the embedded homepage ad cards and the "漫剧" / "相声评书" home categories observed in the supplied HAR.

Install in Loon:

`https://raw.githubusercontent.com/Pialabiala/xmlyads-loon/main/xmlyads.plugin`

The plugin filters `IndexFeedAd` cards from the homepage feed, clears the Ximalaya ad-slot response, removes the two category entries, and rejects Tencent Music ad-material requests. Other Ximalaya content APIs are left intact.
