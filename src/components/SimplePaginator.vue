<template>
    <nav aria-label="pagination flex">
        <ul v-if="showPaginator"
            class="pagination flex list-reset">
            <li v-if="meta.current_page !==1"
                class="page-item m-1 mr-4"
                :class="{disabled: meta.current_page === 1}"
                @click.prevent="prev">
                <a class="pb-1 text-3xl text-teal-dark border-teal-dark no-underline page-link border w-8 h-8 flex inline-block rounded-full justify-center items-center"
                   href="#">
                    &#x2039;
                </a>
            </li>

            <li class="page-item m-1"
                v-if="sections.showPrev && meta.current_page !== 1">
                <a class="text-xs no-underline page-link p-2 w-8 h-8 flex inline-block justify-center items-center"
                   :class=" meta.last_page === 1 ? 'border text-white bg-teal-dark rounded-full' : 'text-teal-dark' "
                   href="#"
                   @click.prevent="toPage(1)">
                    1
                </a>
            </li>

            <li class="page-item m-1"
                v-if="sections.showPrev"
                @click.prevent="sections.prev">
                <a class="text-xs text-teal-dark no-underline page-link p-2 w-8 h-8 flex inline-block rounded-full justify-center items-center"
                   href="#">
                    ...
                </a>
            </li>

            <li class="page-item m-1"
                v-for="(page, index) in pages"
                :key="index">
                <a class="text-xs no-underline page-link p-2 w-8 h-8 flex inline-block justify-center items-center"
                   :class=" page === meta.current_page ? 'border text-white bg-teal-dark rounded-full' : 'text-teal-dark' "
                   href="#"
                   @click.prevent="toPage(page)">
                    {{ page }}
                </a>
            </li>

            <li class="page-item m-1"
                v-if="sections.showNext"
                @click.prevent="sections.next">
                <a class="text-teal-dark text-xs no-underline page-link p-2 w-8 h-8 flex inline-block rounded-full justify-center items-center"
                   href="#">
                    ...
                </a>
            </li>

            <li class="page-item m-1"
                v-if="sections.showNext && meta.current_page !== meta.last_page">
                <a class="text-xs no-underline page-link p-2 w-8 h-8 flex inline-block justify-center items-center"
                   :class=" meta.last_page === meta.current_page ? 'border text-white bg-teal-dark rounded-full' : 'text-teal-dark' "
                   href="#"
                   @click.prevent="toPage(meta.last_page)">
                    {{ meta.last_page}}
                </a>
            </li>

            <li v-if="meta.current_page !==meta.last_page"
                class="page-item m-1 ml-4"
                :class="{disabled: meta.current_page === meta.last_page}"
                @click.prevent="next">
                <a class="text-teal-dark border-teal-dark  pb-1 text-3xl no-underline page-link border w-8 h-8 flex inline-block rounded-full justify-center items-center"
                   href="#">&#x203A; </a>
            </li>
        </ul>
    </nav>
</template>

<script>
export default {
  props: {
    meta: {
      type: Object,
      required: true
    },
    pagesPerSection: {
      type: Number,
      default: 10
    }
  },
  computed: {
    showPaginator () {
      return this.meta !== null && this.meta.total > 0
    },
    currentSection () {
      return Math.ceil(this.meta.current_page / this.pagesPerSection)
    },
    totalSections () {
      return Math.ceil(this.meta.last_page / this.pagesPerSection)
    },
    pages () {
      let pages = this.currentSection !== this.totalSections
        ? this.pagesPerSection
        : this.meta.last_page - this.pagesPerSection * (this.currentSection - 1)
      let pagesArr = Array.from(Array(pages), (val, i) => (this.currentSection - 1) * this.pagesPerSection + i + 1)
      if (this.currentSection === 1) {
        if (this.pagesPerSection > this.meta.last_page) {
          pagesArr = Array.from(Array(this.meta.last_page), (val, i) => i + 1)
        }
        return pagesArr
      }
      if (pagesArr.length < this.pagesPerSection) {
        pagesArr = Array.from(
          Array(this.pagesPerSection),
          (val, i) => pagesArr[pagesArr.length - 1] - this.pagesPerSection + i + 1
        )
      }
      return pagesArr
    },
    sections () {
      let showPrev = this.currentSection > 1
      let showNext = this.currentSection < this.totalSections
      return {
        showNext,
        showPrev,
        prev: () => {
          let page = (this.currentSection - 2) * this.pagesPerSection + 1
          this.toPage(page)
        },
        next: () => {
          let page = this.currentSection * this.pagesPerSection + 1
          this.toPage(page)
        }
      }
    }
  },
  methods: {
    next () {
      this.toPage(parseInt(this.meta.current_page, 10) + 1)
    },
    prev () {
      this.toPage(parseInt(this.meta.current_page, 10) - 1)
    },
    toPage (page) {
      if (page < 1 || page > parseInt(this.meta.last_page, 10)) {
        return
      }
      this.$emit('pagination:switched', page)
    }
  }
}
</script>
