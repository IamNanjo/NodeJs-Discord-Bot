const fetch = (...args) => import("node-fetch").then(({default: fetch}) => fetch(...args))

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
            await fetch(`https://reddit.com/r/${subreddit}.json`)
                .then(response => response.json())
                .then(body => {
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
