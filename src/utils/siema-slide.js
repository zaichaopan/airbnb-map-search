import Siema from 'siema'

export const initSlide = (
  siemaContainer,
  preActionClass,
  nexActionClass,
  siemaClass,
  indicatorsClass
) => {
  const prev = siemaContainer.querySelector(`.${preActionClass}`)
  const next = siemaContainer.querySelector(`.${nexActionClass}`)
  const siema = siemaContainer.querySelector(`.${siemaClass}`)
  const indicators = [
    ...siemaContainer.querySelector(`.${indicatorsClass}`).children
  ]

  const siemaInstance = new Siema({
    selector: siema,
    draggable: false,
    loop: true,
    onInit () {
      indicators[0].classList.add('active')
    },
    onChange () {
      indicators.forEach((value, i) => {
        i === this.currentSlide
          ? value.classList.add('active')
          : value.classList.remove('active')
      })
    }
  })
  prev.addEventListener('click', () => siemaInstance.prev())
  next.addEventListener('click', () => siemaInstance.next())
}

export const initSlides = (
  containerClass,
  preActionClass,
  nextActionClass,
  siemaClass,
  indicatorsClass
) => {
  const siemaContainers = document.querySelectorAll(`.${containerClass}`)
  for (const siemaContainer of siemaContainers) {
    initSlide(
      siemaContainer,
      preActionClass,
      nextActionClass,
      siemaClass,
      indicatorsClass
    )
  }
}
