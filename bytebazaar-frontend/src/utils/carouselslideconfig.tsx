export const carouselResponsiveTemplate = {
    desktop: {
        slidesToSlide: 1,
        breakpoint: {
            max: 9999,
            min: 1441
        },
        items: 5
    },
    laptop_l:{
        breakpoint:{
            min:1024,
            max:1440
        },
        items:5,
    },
    laptop:{
        breakpoint:{
            min:1024,
            max:768
        },
        items:4,
    },
    tablet: {
        slidesToSlide: 1,
        breakpoint: {
            max: 768,
            min: 481
        },
        items: 4
    },
    mobile: {
        slidesToSlide: 1,
        breakpoint: {
            max: 480,
            min: 0
        },
        items: 2
    },
}