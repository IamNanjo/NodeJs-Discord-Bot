const fetch = (...args) => import("node-fetch").then(({default: fetch}) => fetch(...args))
const { writeFileSync } = require("fs")
let botConf = require("./config.json");

let redditLimit = parseInt(botConf["redditLimit"], 10)

const spliceObject = (obj={}, start=0, amount=1) => {
    if(Object.keys(obj).length <= amount) return obj // Don't splice if the object already has less keys than specified in the amount variable

    let result = Object.keys(obj).slice(start, amount).reduce((result, key) => {
        result[key] = obj
    }, {})

    return result
}

module.exports = {
    fetchFromReddit: async(subreddit) => 
    {
        const supportedFileFormats = [
            "png",
            "jpg",
            "jpeg",
        ]
        let urlList = {}
    
        try {
            await fetch(`https://reddit.com/r/${subreddit}.json?after=${botConf.after}`)
                .then(response => response.json())
                .then(body => {
                    botConf["after"][subreddit] = body["data"]["after"]
                    writeFileSync("./config.json", JSON.stringify(botConf, null, 2))
                    let children = body["data"]["children"]

                    children.forEach(e => {
                        let data = e["data"]
                        let postHint = data["post_hint"]
                        let url = data["url"]
                        
                        if(postHint === "image" && supportedFileFormats.includes(url.split(".").pop())) {
                            urlList[url] = data["title"]
                        }
                    })
                })
        }
        catch(err) {
            console.error("Error fetchFromReddit() - ", err)
        }

        urlList = spliceObject(urlList, 0, redditLimit) // 
    
        return urlList
    }
}
