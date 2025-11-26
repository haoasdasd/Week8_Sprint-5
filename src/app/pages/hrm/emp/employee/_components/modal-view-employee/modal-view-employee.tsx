import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Col, FormGroup, Input, Label, Nav, NavItem, Row, TabContent, TabPane } from 'reactstrap'
import { employeeQueryApi } from '~/app/apis/employee/query/employee.query.api'
import ModalCommon from '~/app/components/modal-common-component'
import { CONFIG_LANG_KEY } from '~/app/configs/lang-key.config'
import { TANSTACK_KEY } from '~/app/configs/tanstack-key.config'
import { useLang } from '~/app/hooks/use-lang'
import styles from './modal-view-employee.module.scss'
import classNames from 'classnames/bind'
import Image from '~/app/components/image-component'
import { formatDateTimestamp } from '~/app/utils/string.util'

interface ModalViewEmployeeProps {
    id: number
    modal: boolean
    toggle: (id?: number) => void
}

const cx = classNames.bind(styles)
export default function ModalViewEmployee({ id, modal, toggle }: ModalViewEmployeeProps) {
    const [activeTab, setActiveTab] = useState('1')

    const { getLangKey } = useLang()
    const { data: employee } = useQuery({
        queryKey: [TANSTACK_KEY.EMPLOYEE_ONE, id],
        queryFn: () => employeeQueryApi.getEmployeeById(id),
        enabled: !!id
    })
    return (
        <ModalCommon
            modal={modal}
            onClose={() => toggle()}
            title={getLangKey(CONFIG_LANG_KEY.PAGE_EMPLOYEE_DETAIL_EMPLOYEE)}
            size='lg'
        >
            <Nav className={cx('navTabs')} tabs>
                <NavItem>
                    <NavLink
                        to={'#'}
                        className={cx('navTabsItem', { active: activeTab === '1' })}
                        onClick={() => setActiveTab('1')}
                    >
                        <i className='ri-info-card-fill '></i>
                        <span>{getLangKey(CONFIG_LANG_KEY.PAGE_EMPLOYEE_TAB_CONTACT_INFORMATION)}</span>
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink
                        className={cx('navTabsItem', { active: activeTab === '2' })}
                        to={'#'}
                        onClick={() => setActiveTab('2')}
                    >
                        <i className='ri-group-fill'></i>
                        <span>{getLangKey(CONFIG_LANG_KEY.PAGE_EMPLOYEE_TAB_CONTACT_LEGAL)}</span>
                    </NavLink>
                </NavItem>
            </Nav>
            <TabContent activeTab={activeTab}>
                <TabPane tabId='1'>
                    <Row>
                        <Col
                            lg={4}
                            style={{ textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                        >
                            <FormGroup>
                                <Image className={cx('image')} src={employee?.empImage} />
                                <h5 className='fs-13 mt-3'>{employee?.empFirstName + ' ' + employee?.empLastName}</h5>
                            </FormGroup>
                        </Col>
                        <Col lg={8}>
                            <Row className='gx-2 gy-3'>
                                <Col lg={6}>
                                    <div className={cx('group')}>
                                        <Label className={cx('title')}>
                                            <i className='ri-info-card-line'></i>
                                            <span>{getLangKey(CONFIG_LANG_KEY.PAGE_EMPLOYEE_TITLE_INPUT_CODE)}</span>
                                        </Label>
                                        <span className={cx('content')}>{employee?.empCode || '-'}</span>
                                    </div>
                                </Col>
                                <Col lg={6}>
                                    <div className={cx('group')}>
                                        <Label className={cx('title')}>
                                            <i className='ri-mail-line'></i>
                                            <span>{getLangKey(CONFIG_LANG_KEY.PAGE_EMPLOYEE_TITLE_INPUT_EMAIL)}</span>
                                        </Label>
                                        <span className={cx('content')}>{employee?.empCode || '-'}</span>
                                    </div>
                                </Col>
                                <Col lg={6}>
                                    <div className={cx('group')}>
                                        <Label className={cx('title')}>
                                            <i className='ri-calendar-line'></i>
                                            <span>{getLangKey(CONFIG_LANG_KEY.PAGE_EMPLOYEE_TITLE_INPUT_DATE_OF_BIRTH)}</span>
                                        </Label>
                                        <span className={cx('content')}>
                                            {formatDateTimestamp(employee?.empBirthday).toLocaleDateString('vi-VN') || '-'}
                                        </span>
                                    </div>
                                </Col>
                                <Col lg={6}>
                                    <div className={cx('group')}>
                                        <Label className={cx('title')}>
                                            <i className='ri-group-line'></i>
                                            <span>{getLangKey(CONFIG_LANG_KEY.PAGE_EMPLOYEE_TITLE_INPUT_GENDER)}</span>
                                        </Label>
                                        <span className={cx('content')}>
                                            {!employee?.empGender
                                                ? getLangKey(CONFIG_LANG_KEY.ERP365_MALE)
                                                : getLangKey(CONFIG_LANG_KEY.ERP365_FEMALE) || '-'}
                                        </span>
                                    </div>
                                </Col>
                                <Col lg={6}>
                                    <div className={cx('group')}>
                                        <Label className={cx('title')}>
                                            <i className='ri-phone-line'></i>
                                            <span>{getLangKey(CONFIG_LANG_KEY.PAGE_EMPLOYEE_TITLE_INPUT_TEL)}</span>
                                        </Label>
                                        <span className={cx('content')}>{employee?.empTel || '-'}</span>
                                    </div>
                                </Col>
                                <Col lg={6}>
                                    <div className={cx('group')}>
                                        <Label className={cx('title')}>
                                            <i className='ri-map-pin-line'></i>
                                            <span>{getLangKey(CONFIG_LANG_KEY.PAGE_EMPLOYEE_TITLE_INPUT_PLACE_OF_BIRTH)}</span>
                                        </Label>
                                        <span className={cx('content')}>{employee?.empPlaceOfBirthName.provinceName || '-'}</span>
                                    </div>
                                </Col>
                                <Col lg={6}>
                                    <div className={cx('group')}>
                                        <Label className={cx('title')}>
                                            <i className='ri-id-card-line'></i>
                                            <span>{getLangKey(CONFIG_LANG_KEY.PAGE_EMPLOYEE_TITLE_INPUT_CI_ID)}</span>
                                        </Label>
                                        <span className={cx('content')}>{employee?.empCitizenIdentity || '-'}</span>
                                    </div>
                                </Col>
                                <Col lg={6}>
                                    <div className={cx('group')}>
                                        <Label className={cx('title')}>
                                            <i className='ri-calendar-line'></i>
                                            <span>{getLangKey(CONFIG_LANG_KEY.PAGE_EMPLOYEE_TITLE_INPUT_JOIN_DATE)}</span>
                                        </Label>
                                        <span className={cx('content')}>
                                            {formatDateTimestamp(employee?.empJoinedDate).toLocaleDateString('vi-VN') || '-'}
                                        </span>
                                    </div>
                                </Col>
                                <Col lg={6}>
                                    <div className={cx('group')}>
                                        <Label className={cx('title')}>
                                            <i className='ri-graduation-cap-line'></i>
                                            <span>{getLangKey(CONFIG_LANG_KEY.PAGE_EMPLOYEE_TITLE_INPUT_EDUCATION_LEVEL)}</span>
                                        </Label>
                                        <span className={cx('content')}>{employee?.empEducationLevel || '-'}</span>
                                    </div>
                                </Col>
                                <Col lg={6}>
                                    <div className={cx('group')}>
                                        <Label className={cx('title')}>
                                            <i className='ri-heart-line'></i>
                                            <span>{getLangKey(CONFIG_LANG_KEY.ERP365_MARITAL)}</span>
                                        </Label>
                                        <span className={cx('content')}>{employee?.maritalStatusName || '-'}</span>
                                    </div>
                                </Col>
                                <Col lg={6}>
                                    <div className={cx('group')}>
                                        <Label className={cx('title')}>
                                            <i className='ri-group-line'></i>
                                            <span>{getLangKey(CONFIG_LANG_KEY.ERP365_NATION)}</span>
                                        </Label>
                                        <span className={cx('content')}>{employee?.nationName || '-'}</span>
                                    </div>
                                </Col>
                                <Col lg={6}>
                                    <div className={cx('group')}>
                                        <Label className={cx('title')}>
                                            <i className='ri-book-open-line'></i>
                                            <span>{getLangKey(CONFIG_LANG_KEY.ERP365_RELIGION)}</span>
                                        </Label>
                                        <span className={cx('content')}>{employee?.religionName || '-'}</span>
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                        <Col lg={12}>
                            <Row className='gx-2 gy-3'>
                                <Col lg={12}>
                                    <div className={cx('location')}>
                                        <i className='ri-map-pin-line'></i>
                                        <span>{getLangKey(CONFIG_LANG_KEY.ERP365_LOCATION)}</span>
                                    </div>
                                </Col>
                                <Col lg={3}>
                                    <div className={cx('group')}>
                                        <Label className={cx('title')}>{getLangKey(CONFIG_LANG_KEY.ERP365_LOCAL)}</Label>
                                        <Input
                                            className={cx('input')}
                                            value={employee?.ward.webLocalInfo.id || getLangKey(CONFIG_LANG_KEY.ERP365_EMPTY)}
                                            readOnly
                                            disabled
                                        />
                                    </div>
                                </Col>
                                <Col lg={3}>
                                    <div className={cx('group')}>
                                        <Label className={cx('title')}>{getLangKey(CONFIG_LANG_KEY.ERP365_PROVINCE)}</Label>
                                        <Input
                                            className={cx('input')}
                                            value={
                                                employee?.ward.localProvinceInfo.provinceName ||
                                                getLangKey(CONFIG_LANG_KEY.ERP365_EMPTY)
                                            }
                                            readOnly
                                            disabled
                                        />
                                    </div>
                                </Col>
                                <Col lg={3}>
                                    <div className={cx('group')}>
                                        <Label className={cx('title')}>{getLangKey(CONFIG_LANG_KEY.ERP365_DISTRICT)}</Label>
                                        <Input
                                            className={cx('input')}
                                            value={
                                                employee?.ward.localDistrictInfo.districtName ||
                                                getLangKey(CONFIG_LANG_KEY.ERP365_EMPTY)
                                            }
                                            readOnly
                                            disabled
                                        />
                                    </div>
                                </Col>
                                <Col lg={3}>
                                    <div className={cx('group')}>
                                        <Label className={cx('title')}>{getLangKey(CONFIG_LANG_KEY.ERP365_WARD)}</Label>
                                        <Input
                                            className={cx('input')}
                                            value={
                                                employee?.ward.localWardInfo.wardName || getLangKey(CONFIG_LANG_KEY.ERP365_EMPTY)
                                            }
                                            readOnly
                                            disabled
                                        />
                                    </div>
                                </Col>
                                <Col lg={12}>
                                    <div className={cx('group')}>
                                        <Label className={cx('title')}>
                                            <span>{getLangKey(CONFIG_LANG_KEY.PAGE_EMPLOYEE_TITLE_INPUT_ADDRESS)}</span>
                                        </Label>
                                        <span className={cx('content')}>{employee?.empPlaceOfResidenceAddress || '-'}</span>
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </TabPane>
                <TabPane tabId='2'>
                    <Row className='gx-2 gy-3'>
                        <Col lg={6}>
                            <div className={cx('group')}>
                                <Label className={cx('title')}>
                                    <i className='ri-file-text-line'></i>
                                    <span>{getLangKey(CONFIG_LANG_KEY.PAGE_EMPLOYEE_TITLE_INPUT_TAX_CODE)}</span>
                                </Label>
                                <span className={cx('content')}>{employee?.empTaxCode || '-'}</span>
                            </div>
                        </Col>
                        <Col lg={6}>
                            <div className={cx('group')}>
                                <Label className={cx('title')}>
                                    <i className='ri-graduation-cap-line'></i>
                                    <span>{getLangKey(CONFIG_LANG_KEY.ERP365_DEGREE)}</span>
                                </Label>
                                <span className={cx('content')}>{employee?.degreeName || '-'}</span>
                            </div>
                        </Col>
                        <Col lg={6}>
                            <div className={cx('group')}>
                                <Label className={cx('title')}>
                                    <i className='ri-briefcase-line'></i>
                                    <span>{getLangKey(CONFIG_LANG_KEY.ERP365_EMPLOYEE_ROLE)}</span>
                                </Label>
                                <span className={cx('content')}>{employee?.empRoleName || '-'}</span>
                            </div>
                        </Col>
                        <Col lg={6}>
                            <div className={cx('group')}>
                                <Label className={cx('title')}>
                                    <i className='ri-book-open-line'></i>
                                    <span>{getLangKey(CONFIG_LANG_KEY.ERP365_TRAINING_MAJOR)}</span>
                                </Label>
                                <span className={cx('content')}>{employee?.traMajName || '-'}</span>
                            </div>
                        </Col>
                        <Col lg={6}>
                            <div className={cx('group')}>
                                <Label className={cx('title')}>
                                    <i className='ri-building-4-line'></i>
                                    <span>{getLangKey(CONFIG_LANG_KEY.ERP365_BANK)}</span>
                                </Label>
                                <span className={cx('content')}>{employee?.bankName || '-'}</span>
                            </div>
                        </Col>
                        <Col lg={6}>
                            <div className={cx('group')}>
                                <Label className={cx('title')}>
                                    <i className='ri-bank-card-line'></i>
                                    <span>{getLangKey(CONFIG_LANG_KEY.PAGE_EMPLOYEE_TITLE_INPUT_ACCOUNT_NUMBER)}</span>
                                </Label>
                                <span className={cx('content')}>{employee?.empAccountNumber || '-'}</span>
                            </div>
                        </Col>
                    </Row>
                </TabPane>
            </TabContent>
        </ModalCommon>
    )
}
