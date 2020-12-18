import React, {useState} from 'react'
import {render} from 'react-dom'

import DeckGL from '@deck.gl/react'
import { Tiles3DLoader } from '@loaders.gl/3d-tiles'
import { Tile3DLayer, TileLayer } from '@deck.gl/geo-layers'
import { BitmapLayer } from '@deck.gl/layers'

const INITIAL_VIEW_STATE = {
  longitude: 138.014232,
  latitude: 34.774984,
  zoom: 13,
  pitch: 0,
  bearing: 0
}

function App() {
  const [initialViewState, setInitialViewState] = useState(INITIAL_VIEW_STATE)
  const onTilesetLoad = tileset => {
    const {cartographicCenter, zoom} = tileset;
    setInitialViewState({
      ...INITIAL_VIEW_STATE,
      longitude: cartographicCenter[0],
      latitude: cartographicCenter[1],
      zoom
    })
  }
  const tile3dlayer = new Tile3DLayer({
    id: 'tile-3d-layer',
    // tileset json file url 
    data: 'https://tiles.smellman.org/kakegawa/ept-tileset/tileset.json',
    loader: Tiles3DLoader,
    onTilesetLoad
  })

  const tile2dlayer = new TileLayer({
    id: 'gsi-std',
    data: 'https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png',
    minZoom: 0,
    maxZoom: 18,
    renderSubLayers: props => {
      const {
        bbox: {west, south, east, north}
      } = props.tile

      return new BitmapLayer(props, {
        data: null,
        image: props.data,
        bounds: [west, south, east, north]
      })
    },
  })

  return <DeckGL initialViewState={initialViewState} layers={[tile3dlayer, tile2dlayer]} controller={true} />
}

render(<App />, document.body.appendChild(document.createElement('div')))