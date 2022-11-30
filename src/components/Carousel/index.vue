<template>
    <!--banner轮播-->
    <div class="swiper-container" ref="cur">
        <div class="swiper-wrapper">
            <div class="swiper-slide" v-for="carousel in list" :key="carousel.id">
                <img :src="carousel.imgUrl" />
            </div>
        </div>
        <!-- 如果需要分页器 -->
        <div class="swiper-pagination"></div>

        <!-- 如果需要导航按钮 -->
        <div class="swiper-button-prev"></div>
        <div class="swiper-button-next"></div>
    </div>
</template>

<script>
import 'swiper/dist/js/swiper'
import Swiper from "swiper"
export default {
    name: 'Carousel',
    props: ['list'],
    watch: {
        // 监听bannerList数据的变化
        list: {
            // 上来就立即监听
            immediate:true,
            // 对象写法
            // 如果执行了handler方法，代表组件实例身上这个属性已经有了【数组：四个元素】
            // 只能保证数据已经有了，没办法保证v-for执行结束
            handler(newValue, oldValue) {
                // 因为dispatch当中涉及到异步语句，导致v-for遍历的时候结构还没有完全因此不行
                // netxTick:在下次DOM更新循环结束之后在修改数据后立即使用这个方法获取更新后的DOM
                this.$nextTick(() => {
                    // 当执行回调的时候保证服务器数据回来v-for执行完毕
                    new Swiper(this.$refs.cur, {
                        // direction: 'vertical', // 垂直切换选项
                        loop: true, // 循环模式选项
                        autoplay: {
                            delay:1500
                        },
                        // 如果需要分页器
                        pagination: {
                            el: '.swiper-pagination',
                            clickable: true,
                        },
                        // 如果需要前进后退按钮
                        navigation: {
                            nextEl: '.swiper-button-next',
                            prevEl: '.swiper-button-prev',
                        },
                    })
                })
            }
        }
    },
}
</script>

<style>

</style>