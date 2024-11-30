function parseYouTubeUrl(url: string): string {
	// e.g. https://www.youtube.com/watch?v=mgAv3NSgyYs
	const urlObj = new URL(url);
	// e.g. mgAv3NSgyYs
	const videoId = urlObj.searchParams.get("v");

	if (videoId) {
		return `https://www.youtube.com/embed/${videoId}`;
	}

	// Just return the original URL if it's not a YouTube video
	return url;
}
