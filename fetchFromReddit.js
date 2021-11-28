const fetch = (...args) => import("node-fetch").then(({default: fetch}) => fetch(...args))
const { writeFileSync } = require("fs")
let botConf = require("./botConfig/defaults.json");

let redditLimit = parseInt(botConf["redditLimit"], 10)

const spliceObject = (obj={}, start=0, amount=1) => {
    if(Object.keys(obj).length <= amount) return obj // Don't splice if the object already has less keys than specified in the amount variable

    let result = Object.keys(obj).slice(start, amount).reduce((result, key) => {
        result[key] = obj[key]
        return result
    }, {})

    return result
}

module.exports = {
    fetchFromReddit: async(subreddit="memes", amount=redditLimit) => 
    {
        const supportedFileFormats = [
            "png",
            "jpg",
            "jpeg",
        ]
        let urlList = {}

        const doFetch = () => {
            try {
                await fetch(`https://reddit.com/r/${subreddit}.json?after=${botConf["after"][subreddit]}`)
                    .then(response => response.json())
                    .then(body => {
                        botConf["after"][subreddit] = body["data"]["after"]
                        writeFileSync("./botConfig/defaults.json", JSON.stringify(botConf, null, 2))
                        let children = body["data"]["children"]
    
                        children.forEach(e => {
                            let data = e["data"]
                            let postHint = data["post_hint"]
                            let url = data["url"]
                            
                            if(postHint === "image" && supportedFileFormats.includes(url.split(".").pop())) {
                                urlList[url] = {
                                    "title": data["title"],
                                    "link": data["permalink"]
                                }
                            }
                        })
                    }).catch(err => console.error(err))
            }
            catch(err) {
                console.error("Error fetchFromReddit() - ", err)
            }

            return urlList
        }
    
        return spliceObject(urlList, 0, amount)
    }
}
