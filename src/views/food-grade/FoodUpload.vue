<template>
<div>
    <croppa
        style="width: 100vmin;height: 80vmin"
        placeholder="请选择一张图"
        :show-loading="true"
        :auto-sizing="true"
        v-model="myCroppa">
    </croppa>
</div>
</template>

<script>
    export default {
        name: 'food-upload',
        components: {
        },
        data () {
            return {
                myCroppa: {}
            };
        },
        methods: {
            uploadCroppedImage () {
                this.myCroppa.generateBlob((blob) => {
                    // write code to upload the cropped image file (a file is a blob)
                }, 'image/jpeg', 0.8); // 80% compressed jpeg file
            }
        }
    };
</script>

<style scoped>

</style>
