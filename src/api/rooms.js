import faker from 'faker'

let rooms = []
let center = { lat: 49.166592, lng: -123.133568 }

const addFakerRooms = number => {
  for (let i = 1; i <= number; i++) {
    rooms = [
      ...rooms,
      {
        id: i,
        name: faker.address.streetAddress() + ' ' + faker.address.city(),
        lat:
          center.lat +
          Number(Math.random().toFixed(7)) *
          [-1, 1][Math.floor(Math.random() * 2)],
        lng:
          center.lng +
          Number(Math.random().toFixed(7)) *
          [-1, 1][Math.floor(Math.random() * 2)],
        price: Number(Math.random() * 2000).toFixed(2),
        images: [1, 2, 3, 4, 5].map(
          x => `https://placeimg.com/280/186/arch?time=${Math.random()}`
        ),
        rating: Math.floor(Math.random() * 5)
      }
    ]
  }
}

const queryStringToObj = queryString => {
  let obj = {}
  let query = queryString.substring(1)
  if (query) {
    query.split('&').forEach(param => {
      let [key, val] = param.split('=')
      val && (obj[key] = decodeURIComponent(val))
    })
  }
  return obj
}

addFakerRooms(100)

export default {
  getAll (url) {
    let query = url.match(/\?(.+)/)
    let queryString = query ? query[0] : ''

    if (queryString === '') {
      throw new Error('Please provider correct url')
    }

    let {
      min_lat: minLat,
      max_lat: maxLat,
      min_lng: minLng,
      max_lng: maxLng,
      page,
      items_per_page: itemsPerPage = 9
    } = queryStringToObj(queryString)

    let filteredRooms = rooms.filter(({ lat, lng }) => {
      return (
        lat >= Number(minLat) &&
        lat <= Number(maxLat) &&
        lng >= Number(minLng) &&
        lng <= Number(maxLng)
      )
    })

    return new Promise(function (resolve, reject) {
      setTimeout(() => {
        resolve({
          data: filteredRooms.slice(
            (page - 1) * itemsPerPage,
            page * itemsPerPage
          ),
          meta: {
            current_page: parseInt(page, 10),
            last_page: Math.ceil(filteredRooms.length / itemsPerPage),
            per_page: itemsPerPage,
            total: filteredRooms.length
          }
        })
      }, 500)
    })
  }
}
