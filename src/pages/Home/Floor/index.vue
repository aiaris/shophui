<template>
    <!--楼层-->
    <div class="floor">
        <div class="py-container">
            <div class="title clearfix">
                <h3 class="fl">{{list.name}}</h3>
                <div class="fr">
                    <ul class="nav-tabs clearfix">
                        <li v-for="(nav,index) in list.navList" :key="index">
                            <a href="#tab1" data-toggle="tab">{{nav.text}}</a>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="tab-content">
                <div class="tab-pane">
                    <div class="floor-1">
                        <div class="blockgary">
                            <ul class="jd-list">
                                <li v-for="(keyword,index) in list.keywords" :key="index">{{keyword}}</li>
                            </ul>
                            <img :src="list.imgUrl" />
                        </div>
                        <div class="floorBanner">
                            <!-- 轮播图 -->
                            <Carousel :list="list.carouselList"/>
                        </div>
                        <div class="split">
                            <span class="floor-x-line"></span>
                            <div class="floor-conver-pit">
                                <img :src="list.recommendList[0]" />
                            </div>
                            <div class="floor-conver-pit">
                                <img :src="list.recommendList[1]" />
                            </div>
                        </div>
                        <div class="split center">
                            <img :src="list.bigImg" />
                        </div>
                        <div class="split">
                            <span class="floor-x-line"></span>
                            <div class="floor-conver-pit">
                                <img :src="list.recommendList[2]" />
                            </div>
                            <div class="floor-conver-pit">
                                <img :src="list.recommendList[3]" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ['list'],
}
</script>

<style scoped>
@import './index.css';
</style>