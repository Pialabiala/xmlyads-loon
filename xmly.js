const url = $request.url || "";
const body = $response.body;
if (!body) { $done({}); }

function isAdCard(value) {
    if (!value || typeof value !== "object" || Array.isArray(value)) return false;
    const item = value.item && typeof value.item === "object" ? value.item : value;
    const bizType = String(item.bizType || "");
    const contentType = String(item.contentType || "");
    const extra = item.ext && item.ext.extraInfo ? item.ext.extraInfo : {};
    const title = String(item.title || item.ubtV2 && item.ubtV2.title || "");
    return bizType === "IndexFeedAd" || contentType.indexOf("IndexFeedAd/") === 0 ||
        extra.ad === "true" || extra.adEmptyCard === "true" ||
        title === "双列流广告卡" || title === "新首页大图广告";
}

function stripFeedAds(value) {
    if (Array.isArray(value)) {
        return value.filter(function (entry) { return !isAdCard(entry); }).map(stripFeedAds);
    }
    if (!value || typeof value !== "object") return value;
    Object.keys(value).forEach(function (key) {
        value[key] = stripFeedAds(value[key]);
    });
    return value;
}

function shouldRemoveCategory(value) {
    if (!value || typeof value !== "object") return false;
    const title = String(value.title || "").replace(/\s/g, "");
    return title === "漫剧" || title === "相声" || title === "相声评书";
}

try {
    const obj = JSON.parse(body);

    if (/\/discovery-feed\/v4\/mix\//.test(url)) {
        stripFeedAds(obj);
    } else if (/\/discovery-category\/customCategories\//.test(url)) {
        if (Array.isArray(obj.categoryList)) {
            obj.categoryList.forEach(function (group) {
                if (group && Array.isArray(group.itemList)) {
                    group.itemList = group.itemList.filter(function (item) { return !shouldRemoveCategory(item); });
                }
            });
        }
        if (Array.isArray(obj.customCategoryList)) {
            obj.customCategoryList = obj.customCategoryList.filter(function (item) { return !shouldRemoveCategory(item); });
        }
    } else if (/\/adx\/ad(?:\?|$)/.test(url)) {
        if (Array.isArray(obj.slotAds)) obj.slotAds = [];
    }

    $done({ body: JSON.stringify(obj) });
} catch (e) {
    $done({ body: body });
}
