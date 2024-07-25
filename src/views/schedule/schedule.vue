<template>
    <div class="pages">
        <pageTitle name="学校作息表"></pageTitle>
        <div class="content">
            <div class="list">
                <div class="label">作息表：</div>
                <div class="value">
                    <img :src="tableData.img" alt="" />
                </div>
            </div>
            <div class="btn">
                <el-button type="primary" size="medium" @click="openPopup">编辑</el-button>
            </div>
        </div>
        <el-dialog v-model="Popup" title="作息表" width="550">
            <div class="e_body">
                <el-form :model="userForm" ref="ruleFormRef" :rules="rules" label-width="70">
                    <el-form-item label="作息表:" prop="img">
                        <el-upload class="avatar-uploader" :show-file-list="false" :http-request="uploadPicture">
                            <img v-if="userForm.img" :src="userForm.img" class="avatar" alt="" />
                            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
                        </el-upload>
                    </el-form-item>
                </el-form>
            </div>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="Popup = false">取消</el-button>
                    <el-button type="primary" @click="submitForm"> 确认 </el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
    import { reactive, ref, onMounted } from 'vue'
    import { uploadImg } from '@/axios/commonHttps'
    import { getInfo, editInfo } from './schedule'
    import type { UploadRequestOptions } from 'element-plus'

    const tableData = ref<any>([])

    const Popup = ref(false)

    const userForm = ref({
        id: null,
        img: '',
        name: '学校作息表',
    })

    const ruleFormRef = ref<any>(null)

    const getTableData = () => {
        getInfo().then((res: any) => {
            if (res.code) {
                tableData.value = res.data[0]
            }
        })
    }

    onMounted(() => {
        getTableData()
    })

    const uploadPicture = (params: UploadRequestOptions) => {
        const file = params.file
        const formData = new FormData()
        formData.append('file', file)
        uploadImg(formData).then((res: any) => {
            if (res.code === 200) {
                userForm.value.img = res.data.url
                ElMessage.success('图片上传成功')
                ruleFormRef.value?.clearValidate('avatar')
            }
        })
    }

    const openPopup = () => {
        userForm.value = { ...tableData.value }
        Popup.value = true
    }

    const submitForm = () => {
        if (!ruleFormRef.value) return
        ruleFormRef.value.validate((valid: any) => {
            console.log(userForm.value)
            const params = { ...userForm.value }
            editInfo(params).then((res: any) => {
                Popup.value = false
                getTableData()
            })
        })
    }
</script>

<style lang="scss">
    .avatar-uploader .el-upload {
        border: 1px dashed var(--el-border-color);
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        transition: var(--el-transition-duration-fast);
    }

    .avatar-uploader .el-upload:hover {
        border-color: var(--el-color-primary);
    }

    .el-icon.avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        text-align: center;
    }
</style>

<style scoped lang="scss">
    .pages {
        height: 100%;
        display: flex;
        flex-direction: column;
        background-color: #ffffff;
        padding: 10px 30px;

        .content {
            flex: 1;
            padding: 20px;
            .list {
                margin-top: 20px;
                display: flex;
                .label {
                    min-width: 120px;
                    font-weight: bold;
                }
                .value {
                    img {
                        max-width: 400px;
                    }
                }
            }
            .btn {
                margin-top: 20px;
                margin-left: 120px;
            }
        }

        .e_body {
            width: 100%;
            max-height: 500px;
            overflow: scroll;
            display: flex;
            justify-content: center;
            .el-form {
                width: 80%;
                .avatar-uploader {
                    display: flex;
                    justify-content: center;
                    margin-top: 20px;
                    .avatar {
                        max-width: 300px;
                        height: auto;
                        display: block;
                    }
                }
            }
        }
    }
</style>
