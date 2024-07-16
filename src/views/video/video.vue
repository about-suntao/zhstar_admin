<template>
    <div class="pages">
        <pageTitle name="视频管理"></pageTitle>
        <div class="content">
            <div class="list">
                <div class="label">标题：</div>
                <div class="value">{{ tableData.name }}</div>
            </div>
            <div class="list">
                <div class="label">描述：</div>
                <div class="value">{{ tableData.description }}</div>
            </div>
            <div class="list">
                <div class="label">封面图片：</div>
                <div class="value">
                    <img :src="tableData.picture" alt="" />
                </div>
            </div>
            <div class="list">
                <div class="label">视频链接：</div>
                <div class="value">
                    <video :src="tableData.url" controls width="600" height="auto"></video>
                </div>
            </div>
            <div class="btn">
                <el-button type="primary" size="medium" @click="openPopup">编辑</el-button>
            </div>
        </div>
        <el-dialog v-model="Popup" title="视频管理" width="750">
            <div class="e_body">
                <el-form :model="userForm" ref="ruleFormRef" :rules="rules" label-width="70">
                    <el-form-item label="标题:" prop="name">
                        <el-input v-model="userForm.name" placeholder="请输入标题" />
                    </el-form-item>
                    <el-form-item label="描述:" prop="description">
                        <el-input v-model="userForm.description" placeholder="请输入描述" />
                    </el-form-item>
                    <el-form-item label="封面:" prop="picture">
                        <el-upload class="avatar-uploader" :show-file-list="false" :http-request="uploadPicture">
                            <img v-if="userForm.picture" :src="userForm.picture" class="avatar" alt="" />
                            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
                        </el-upload>
                    </el-form-item>
                    <el-form-item label="视频:" prop="picture">
                        <el-upload class="avatar-uploader" :show-file-list="false" :http-request="uploadVideo">
                            <video v-if="userForm.url" :src="userForm.url" controls class="avatar"></video>
                            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
                        </el-upload>
                    </el-form-item>
                    <p style="margin-left: 70px">视频上传较慢，请耐心等待</p>
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
    import { getInfo, editInfo } from './video'
    import type { UploadRequestOptions, FormRules } from 'element-plus'

    const tableData = ref<any>([])

    const Popup = ref(false)

    const userForm = ref({
        id: null,
        name: '',
        description: '',
        picture: null,
        url: null,
    })

    const ruleFormRef = ref<any>(null)
    const checkPicture = (rule: any, value: any, callback: any) => {
        if (value) {
            callback()
        } else {
            callback(new Error('请先上传图片!'))
        }
    }

    const rules = reactive<FormRules>({
        name: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        description: [{ required: true, message: '请输入描述', trigger: 'blur' }],
    })

    const getTableData = () => {
        getInfo().then((res: any) => {
            if (res.code) {
                tableData.value = res.data.list[0]
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
                userForm.value.picture = res.data.url
                ElMessage.success('图片上传成功')
                ruleFormRef.value?.clearValidate('avatar')
            }
        })
    }

    const uploadVideo = async (params: UploadRequestOptions) => {
        const file = params.file
        const formData = new FormData()
        formData.append('file', file)

        const loading = ElLoading.service({
            lock: true,
            text: '视频上传中，请耐心等待...',
            background: 'rgba(0, 0, 0, 0.7)',
        })

        try {
            const res: any = await uploadImg(formData)
            if (res.code === 200) {
                userForm.value.url = res.data.url
                ElMessage.success('视频上传成功')
                ruleFormRef.value?.clearValidate('avatar')
            } else {
                ElMessage.error('视频上传失败')
            }
        } catch (error) {
            ElMessage.error('视频上传失败')
        } finally {
            loading.close()
        }
    }

    const openPopup = () => {
        userForm.value = {
            ...tableData.value,
            picture: null,
            url: null,
        }
        Popup.value = true
    }

    const submitForm = () => {
        if (!ruleFormRef.value) return
        ruleFormRef.value.validate((valid: any) => {
            const params = {
                ...userForm.value,
                picture: userForm.value.picture ? userForm.value.picture : tableData.value.picture,
                url: userForm.value.url ? userForm.value.url : tableData.value.url,
            }
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
