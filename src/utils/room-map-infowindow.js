import { initSlides } from './siema-slide'

const createSlideHtml = marker => {
  return marker.room.images
    .map(image => {
      return `
        <a href="#">
          <img src="${image}" alt="${marker.room.name}"/>
        </a>
       `
    })
    .join('')
}

const createRatingHtml = marker => {
  const maxRating = 5
  const rating = marker.room.rating
  const fullStars = Array.from(new Array(rating), (val, index) => index + 1)
  const emptyStars = Array.from(
    new Array(maxRating - rating),
    (val, index) => index + 1 + rating
  )

  const fullStarsHtml = fullStars
    .map(start => {
      return `<span title="rating">&#9733;</span>`
    })
    .join('')

  const emptyStarsHtml = emptyStars
    .map(start => {
      return `<span title="rating">&#9734;</span>`
    })
    .join('')

  return `<div class="ratings text-xs text-teal-dark">${fullStarsHtml}${emptyStarsHtml}</span>`
}

const createSlideIndicatorHtml = marker => {
  return marker.room.images
    .map(image => {
      return `<span>&#x25cf;</span>`
    })
    .join('')
}

const infoWindow = {
  getContentHtml (marker) {
    return `
      <div class="info-window border border-grey rounded">
        <div class="siema-container">
          <div class="siema">${createSlideHtml(marker)}</div>
          <div class="indicators">${createSlideIndicatorHtml(marker)}</div>
          <button class="prev">&#x2039;</button>
          <button class="next">&#x203A;</button>
        </div>
        <div class="info">
          <div class="title">${marker.room.name}</div>
          <div class="price">$${marker.room.price} CAD per month</div>
          ${createRatingHtml(marker)}
        </div>
      </div>`
  },
  removeWhiteSpace () {
    let iwOuters = document.querySelectorAll('.gm-style-iw')
    for (const iwOuter of iwOuters) {
      let iwBackground = iwOuter.previousElementSibling
      
      if (!iwBackground) {
        return
      }
      
      for (const child of iwBackground.children) {
        child.style.display = 'none'
      }
    }
  },

  initSlides (
    containerClass,
    preActionClass,
    nextActionClass,
    siemaClass,
    indicatorsClass
  ) {
    initSlides(
      containerClass,
      preActionClass,
      nextActionClass,
      siemaClass,
      indicatorsClass
    )
  }
}

export default infoWindow
