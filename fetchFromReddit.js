const fetch = (...args) => import("node-fetch").then(({default: fetch}) => fetch(...args))
const { writeFileSync } = require("fs")

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
            let botConf = require("./config.json");

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
            console.error("Error - ", err)
        }
    
        return urlList
    }
}
