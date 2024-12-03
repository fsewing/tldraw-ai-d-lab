// import _unfurl from 'unfurl.js'
import getMetaData from 'metadata-scraper'


export async function unfurl(url: string) {
	const data = await getMetaData(url)
	//const { title, description, open_graph, twitter_card, favicon } = await _unfurl.unfurl(url)
	//const image = open_graph?.images?.[0]?.url || twitter_card?.images?.[0]?.url
	return {
		"title": data.title,
		"description": data.description,
		"image": data.image,
		"favicon":data.icon,
	}
}