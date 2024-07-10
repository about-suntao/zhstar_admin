<template>
    <div class="tabsChildren">
        <div class="searchForm">
            <div class="search">
                <el-form :model="searchParams">
                    <el-form-item label="标题：">
                        <el-input
                            v-model="searchParams.name"
                            @change="getTableData"
                            clearable
                            placeholder="请输入标题"
                        />
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
                    background: '#EEF4FF',
                }"
                :cell-style="{ textAlign: 'center', fontWeight: '400' }"
                border
            >
                <el-table-column type="selection" width="55" />
                <el-table-column prop="name" label="标题" show-overflow-tooltip />
                <el-table-column prop="picture" label="图片">
                    <template #default="scoped">
                        <el-image class="Img" :src="scoped.row.picture"></el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="sort" label="序号" />
                <el-table-column prop="interiorUrl" label="内部链接" />
                <el-table-column prop="withoutUrl" label="外部链接" />
                <el-table-column label="操作" width="300">
                    <template #default="scope">
                        <el-button type="primary" size="small" @click="openEditPopup(scope.row)"> 编辑 </el-button>
                        <el-button type="danger" size="small" @click="handleDel(scope.row)"> 删除 </el-button>
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
        <el-dialog v-model="Popup" title="新增" width="650">
            <div class="e_body">
                <el-form :model="userForm" ref="ruleFormRef" :rules="rules" label-width="80">
                    <el-form-item label="标题:" prop="name">
                        <el-input v-model="userForm.name" placeholder="请输入用户名" />
                    </el-form-item>
                    <el-form-item label="排序:" prop="sort">
                        <el-input v-model.number="userForm.sort" placeholder="从小到大排序，仅限数字" />
                    </el-form-item>
                    <el-form-item label="内部链接:" prop="interiorUrl">
                        <el-input v-model="userForm.interiorUrl" placeholder="内部网页链接跳转" />
                    </el-form-item>
                    <el-form-item label="外部链接:" prop="withoutUrl">
                        <el-input v-model="userForm.withoutUrl" placeholder="外部网页链接，打开新窗口" />
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
    import { uploadImg } from '@/axios/commonHttps'
    import { getHomeSwiper, addHomeSwiper, editHomeSwiper, delHomeSwiper } from '../banner.ts'

    const tableData = ref([])

    const searchParams = reactive({
        title: null,
        typeId: null,
        pageNum: 1,
        pageSize: 10,
        total: 0,
    })

    const Popup = ref(false)
    const PopupStatus = ref('')

    const userForm = ref({
        id: null,
        name: '',
        picture: null,
        interiorUrl: '',
        withoutUrl: '',
        sort: '',
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
        sort: [{ required: true, type: 'number', message: '请输入正确的序号' }],
        picture: [{ required: true, validator: checkPicture, trigger: 'blur' }],
    })

    const getTableData = () => {
        getHomeSwiper(searchParams).then((res) => {
            if (res.code) {
                tableData.value = res.data.list
                searchParams.total = res.data.total
            }
        })
    }

    onMounted(() => {
        getTableData()
    })

    const openAddPopup = () => {
        userForm.value = {
            id: null,
            name: '',
            picture: null,
            interiorUrl: '',
            withoutUrl: '',
            sort: '',
        }
        PopupStatus.value = 'add'
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

    const openEditPopup = (data: any) => {
        userForm.value = { ...data }
        PopupStatus.value = 'edit'
        Popup.value = true
    }

    const handleAdd = () => {
        addHomeSwiper(userForm.value).then((res: any) => {
            if (res.code === 200) {
                ElMessage.success('新增成功')
                getTableData()
            }
        })
    }
    const handleEdit = () => {
        editHomeSwiper(userForm.value).then((res: any) => {
            if (res.code === 200) {
                ElMessage.success('修改成功')
                getTableData()
            }
        })
    }

    const handleDel = (data: any) => {
        ElMessageBox({
            title: '提示',
            message: `确认删除该图吗？`,
            showCancelButton: true,
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            customStyle: { width: '200px' },
            beforeClose: (action, instance, done) => {
                if (action === 'confirm') {
                    delHomeSwiper({ id: data.id }).then((res: any) => {
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
    const clearSearch = () => {}

    const submitForm = () => {
        if (!ruleFormRef.value) return
        ruleFormRef.value.validate((valid: any) => {
            // 表单验证成功
            if (valid) {
                // 获取规格信息
                PopupStatus.value === 'add' ? handleAdd() : handleEdit()
                Popup.value = false
            } else {
                return false
            }
        })
    }
</script>

<style scoped lang="scss">
    .tabsChildren {
        height: 100%;
        display: flex;
        flex-direction: column;
        background-color: #ffffff;
        .searchForm {
            margin-top: 10px;
            display: flex;
            justify-content: space-between;
            .search {
                .el-form {
                    display: flex;
                    flex-wrap: wrap;
                    .el-form-item {
                        width: 300px;
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
                    max-width: 290px;
                    height: auto;
                }
            }
            :deep(.el-scrollbar__wrap) {
                display: flex;
            }
        }
        .pagination {
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
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
