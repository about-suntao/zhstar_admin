<template>
    <div class="product">
        <pageTitle name="师资团队"></pageTitle>
        <div class="searchForm">
            <div class="search">
                <el-form :model="searchParams">
                    <el-form-item label="名称：">
                        <el-input
                            v-model="searchParams.name"
                            @change="getTableData"
                            clearable
                            placeholder="请输入名称"
                        />
                    </el-form-item>
                    <el-form-item label="类型：">
                        <el-select
                            v-model="searchParams.type"
                            placeholder="请选择类型"
                            @change="getTableData"
                            clearable
                        >
                            <el-option v-for="item in typeOptions" :key="item.id" :label="item.name" :value="item.id" />
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="clearSearch">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="buttonGroup">
                <el-button type="primary" @click="openAddPopup">新增</el-button>
            </div>
        </div>
        <div class="commonTable">
            <el-table
                :data="tableData"
                class="elTable"
                :header-cell-style="{
                    textAlign: 'center',
                    height: '60px',
                    fontSize: '18PX',
                    fontWeight: 'Bold',
                    color: 'black',
                    background: '#FFDCDE',
                }"
                :cell-style="{ textAlign: 'center', fontWeight: '400' }"
                border
            >
                <el-table-column type="selection" width="55" />
                <el-table-column prop="name" label="名称" />
                <el-table-column prop="picture" label="图片">
                    <template #default="scoped">
                        <el-image class="Img" :src="scoped.row.picture"></el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="aphorism" label="格言" show-overflow-tooltip />
                <el-table-column prop="teachSubject" label="任教科目" show-overflow-tooltip />
                <el-table-column prop="education" label="学历" show-overflow-tooltip />
                <el-table-column prop="ingredient" label="成分" show-overflow-tooltip />
                <el-table-column prop="position" label="职称" show-overflow-tooltip />
                <el-table-column prop="intro" label="简介" show-overflow-tooltip />
                <el-table-column prop="professionalSkill" label="专业技能" show-overflow-tooltip />
                <el-table-column prop="type" label="类型">
                    <template #default="scoped">
                        <p>
                            {{
                                scoped.row.type === 1
                                    ? '小学部'
                                    : scoped.row.type === 2
                                    ? '初中部'
                                    : scoped.row.type === 3
                                    ? '高中部'
                                    : ''
                            }}
                        </p>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="200">
                    <template #default="scope">
                        <el-button type="primary" size="small" @click="openEditPopup(scope.row)">编辑</el-button>
                        <el-button type="danger" size="small" @click="delUser(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="pagination">
            <el-pagination
                layout="total,prev, pager, next,sizes"
                :total="searchParams.total"
                v-model:current-page="searchParams.pageNum"
                v-model:page-size="searchParams.pageSize"
                @change="getTableData"
            />
        </div>
        <el-dialog v-model="Popup" :title="PopupStatus === 'add' ? '新增团队' : '管理团队'" width="850">
            <div class="e_body">
                <el-form :model="userForm" ref="ruleFormRef" :rules="rules" label-width="90">
                    <el-form-item label="类型:" prop="type">
                        <el-radio-group v-model="userForm.type" class="ml-4">
                            <el-radio :label="1">小学部</el-radio>
                            <el-radio :label="2">初中部</el-radio>
                            <el-radio :label="3">高中部</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="名称:" prop="name">
                        <el-input v-model="userForm.name" placeholder="请输入用户名" />
                    </el-form-item>

                    <el-form-item label="格言:" prop="aphorism" v-if="userForm.type !== 1">
                        <el-input v-model="userForm.aphorism" placeholder="请输入格言" />
                    </el-form-item>
                    <el-form-item label="任教科目:" prop="teachSubject" v-if="userForm.type !== 1">
                        <el-input v-model="userForm.teachSubject" placeholder="请输入任教科目" />
                    </el-form-item>
                    <el-form-item label="学历:" prop="education" v-if="userForm.type !== 1">
                        <el-input v-model="userForm.education" placeholder="请输入学历" />
                    </el-form-item>
                    <el-form-item label="成分:" prop="ingredient" v-if="userForm.type !== 1">
                        <el-input v-model="userForm.ingredient" placeholder="请输入成分" />
                    </el-form-item>
                    <el-form-item label="职称:" prop="position" v-if="userForm.type !== 1">
                        <el-input v-model="userForm.position" placeholder="请输入职称" />
                    </el-form-item>
                    <el-form-item label="专业技能:" prop="professionalSkill" v-if="userForm.type !== 1">
                        <el-input v-model="userForm.professionalSkill" placeholder="请输入专业技能" />
                    </el-form-item>
                    <el-form-item label="简介:" prop="intro">
                        <el-input v-model="userForm.intro" :rows="4" type="textarea" placeholder="请输入简介" />
                    </el-form-item>
                    <el-form-item label="图片:" prop="picture">
                        <el-upload class="avatar-uploader" :show-file-list="false" :http-request="uploadPicture">
                            <img v-if="userForm.picture" :src="userForm.picture" class="avatar" alt="" />
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
    import { getTeam, addTeam, editTeam, delTeam } from './team'
    import { uploadImg } from '@/axios/commonHttps'
    import type { UploadRequestOptions, FormRules } from 'element-plus'

    const tableData = ref([])
    const searchParams = reactive({
        name: null,
        type: null,
        pageNum: 1,
        pageSize: 10,
        total: 0,
    })

    const typeOptions = [
        {
            id: 1,
            name: '小学部',
        },
        {
            id: 2,
            name: '初中部',
        },
        {
            id: 3,
            name: '高中部',
        },
    ]

    const Popup = ref(false)
    const PopupStatus = ref('')

    const userForm = ref({
        id: null,
        name: '',
        picture: null,
        aphorism: '',
        teachSubject: '',
        education: '',
        ingredient: '',
        position: '',
        intro: '',
        professionalSkill: '',
        type: 1,
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
        type: [{ required: true, message: '请选择类型', trigger: 'blur' }],
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        intro: [{ required: true, message: '请输入简介', trigger: 'blur' }],
        picture: [{ required: true, validator: checkPicture, trigger: 'blur' }],
    })

    const getTableData = () => {
        getTeam(searchParams).then((res: any) => {
            if (res.code) {
                tableData.value = res.data.list
                searchParams.total = res.data.total
            }
        })
    }

    onMounted(() => {
        getTableData()
    })

    const clearSearch = () => {
        getTableData()
    }

    const openAddPopup = () => {
        userForm.value = {
            id: null,
            name: '',
            picture: null,
            aphorism: '',
            teachSubject: '',
            education: '',
            ingredient: '',
            position: '',
            intro: '',
            professionalSkill: '',
            type: 1,
        }
        PopupStatus.value = 'add'
        Popup.value = true
        ruleFormRef.value?.clearValidate()
    }

    const openEditPopup = (data: any) => {
        userForm.value = { ...data }
        PopupStatus.value = 'edit'
        Popup.value = true
    }

    const uploadPicture = (params: UploadRequestOptions) => {
        const file = params.file
        const formData = new FormData()
        formData.append('file', file)
        uploadImg(formData).then((res: any) => {
            if (res.code === 200) {
                userForm.value.picture = res.data.url
                ElMessage.success('图片上传成功')
                ruleFormRef.value?.clearValidate('picture')
            }
        })
    }

    const addUser = () => {
        addTeam(userForm.value).then((res: any) => {
            if (res.code === 200) {
                ElMessage.success('新增成功')
                getTableData()
            }
        })
    }

    const editUser = () => {
        editTeam(userForm.value).then((res: any) => {
            if (res.code === 200) {
                ElMessage.success('修改成功')
                getTableData()
            }
        })
    }

    const delUser = (data: any) => {
        ElMessageBox({
            title: '提示',
            message: `确定删除选中数据吗？`,
            showCancelButton: true,
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            customStyle: { width: '200px' },
            beforeClose: (action, instance, done) => {
                if (action === 'confirm') {
                    delTeam({ id: data.id }).then((res: any) => {
                        instance.confirmButtonLoading = false
                        done()
                        if (res.code === 200) {
                            ElMessage.success('删除成功')
                            getTableData()
                        }
                    })
                } else {
                    done()
                }
            },
        })
    }

    const submitForm = () => {
        if (!ruleFormRef.value) return
        ruleFormRef.value.validate((valid: any) => {
            // 表单验证成功
            if (valid) {
                // 获取规格信息
                PopupStatus.value === 'add' ? addUser() : editUser()
                Popup.value = false
            } else {
                return false
            }
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
    .product {
        height: 100%;
        display: flex;
        flex-direction: column;
        background-color: #ffffff;
        padding: 10px 30px;
        .searchForm {
            margin-top: 30px;
            display: flex;
            justify-content: space-between;
            .search {
                .el-form {
                    display: flex;
                    flex-wrap: wrap;
                    .el-form-item {
                        width: 250px;
                        margin-right: 20px;
                    }
                    .el-form-item:last-child {
                        width: auto;
                    }
                }
            }
            .buttonGroup {
                display: flex;
                justify-content: flex-end;
            }
        }
        .commonTable {
            margin: 10px 0;
            flex: 1;
            overflow: hidden;
            .elTable {
                width: 100%;
                height: 100%;
                .Img {
                    width: 100px;
                    height: auto;
                }
            }
            :deep(.el-scrollbar__wrap) {
                display: flex;
            }
            :deep(.el-table--enable-row-hover .el-table__body tr:hover > td.el-table__cell) {
                background: #fff7f7;
            }
        }
        .pagination {
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        @media screen and (max-width: 1300px) {
            .pagination {
                padding-bottom: 20px;
            }
        }

        .e_body {
            width: 100%;
            display: flex;
            justify-content: center;
            max-height: 500px;
            overflow: scroll;
            .el-form {
                width: 80%;
                .avatar-uploader {
                    display: flex;
                    justify-content: center;
                    margin-top: 20px;
                    .avatar {
                        max-width: 200px;
                        height: auto;
                        display: block;
                    }
                }
            }
        }
    }
</style>
