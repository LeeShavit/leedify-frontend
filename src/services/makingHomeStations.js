import { ApiService } from "./api.service"
import { DEFAULT_IMG } from "./station/station.service.local"

const playlistData = [
    {
        name: "Workout",
        stations: [
            "2SM6rniZl84fEyMCB5KMQB",
            "3U7mEmGXnG3RJ1lrC2Jhvz",
            "5h1oEk4W9KVMHkOd8WWWlC",
            "44imBReuLDHuIP0j4UmCtm",
            "2237sMNMlXS4wWLgdQ1UuV",
            "33Jhav7azn4l03GneOVGr0",
            "5arPxjufbwwMkIu8YGbF5U",
            "7mZZkjpyoY83wHbssEtzNF",
            "7o7kxoFiZN5Q6sxemXq8Se",
            "6rkZzuLbq5LbbFl3u0nTxf"
        ]
    },
    {
        name: "Mood",
        stations: [
            "7INcD4lmarWTQiDVodjVt4",
            "7GhawGpb43Ctkq3PRP1fOL",
            "4Fh0313D3PitYzICKHhZ7r",
            "3IBrsav3Sh8AImtaGoaP07",
            "6hXwzaSaiiWUazPjpQn0Yl",
            "1pmsMvJXvQ6s55bz4FsqCy",
            "0DxreQwReZbZtsRmWZSDE9",
            "4iR2iAuyMiuVkWFe6Sd1gS",
            "3IVRoSXFt1qUoE1VnWlRko",
            "2QZmstQ1M9uD5BENolTmo0",
            "7aPfVb6PXMOnGPEj00Fi56",
        ]
    },
    {
        name: "Trending",
        stations: [
            "2ApNYYNExzXTFad7PrDsws",
            "0PMKjSoU937cvzkHpFJ3hf",
            "4JZFUSM0jb3RauYuRPIUp8",
            "7LLg7z49wkJYMaVSTXJlKE",
            "45GzgV6QdDD5fXBN4i3U0g",
            "7L6mdgEKVTpXlr4UCuG6dt",
            "4173ENNA5eMzHrz9pipvxI",
            "56g65e5cE1AFhsiywnEqdu",
            "67613mkXrKeVTenelKrjFF",
            "65bnBLooDqPNesp11BMZQf"
        ]
    },
    {
        name: "Features",
        stations: [
            "0LbJei7i44UxH9AdhnMuyF",
            "3FFOAuiLSkJbNjE68eFQNN",
            "096em1z0OErabmwqafVeZg",
            "6UG2y1EBrMSm0VzT1x648x",
            "3P1L3uplohybLcqrKZL0ux",
            "4d2zsAyFOsMcJcx1sBTTAw",
            "63F3OonCgfS63S4CXXqGwO"
        ]
    },
    {
        name: "Top playlists",
        stations: [
            "2C5gFiR1k98ieuw5K8OJhm",
            "058Ok7DHY1H4A8njjneZeY",
            "3LJIKHX4Gs8OCoWpaCzzc7",
            "5FirVlzD84v6a5gIRB0CtX",
            "7m1C1eHUC2kJQL69dGMjaz",
            "5KJDMJe9EJ7QRz8FG2MIpI",
            "4hMcqod7ERKJ9mtjgdimeV",
            "487jKTFqWhs6b0AEUz0WpX",
            "7IfWkPjxjtGpHKzvbZd8YV",
            "4Jb4PDWREzNnbZcOHPcZPy"
        ]
    }
]



export async function makeStationsJson() {
    const categoriesData = playlistData.map(getCategoryStations)
    const processedData = await Promise.all(categoriesData)

    const formattedData = playlistData.map((category, index) => ({
        name: category.name,
        stations: processedData[index]
    }))
    const jsonContent = JSON.stringify(formattedData, null, 2)
}

async function getCategoryStations(category) {
    const stations = category.stations.map(getStationData)
    return Promise.all(stations)
}

async function getStationData(stationId) {
    const data= await ApiService.getSpotifyItems({ type: 'station', id: stationId })
    return {
        _id: stationId,
        name: data.name,
        description: data.description ? data.description.replace(/<a\b[^>]*>(.*?)<\/a>/gi, '') : '',
        imgUrl: data.imgUrl || DEFAULT_IMG,
    }
}
