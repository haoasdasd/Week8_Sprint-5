export const APP_ROUTES = {
    // Menus
    HOME: '/',

    // HR
    DEGREE: '/degree',
    CONTRACT_TYPE: '/contract-type',
    TRAINING_MAJOR: '/training-major',
    NATION: '/nation',
    BANK: '/bank',
    RELIGION: '/religion',
    MARITAL: '/marital',
    EMPLOYEE: '/employee',
    EMPLOYEE_ADD: '/employee/add',
    EMPLOYEE_UPDATE: '/employee/update/:id',
    EMPLOYEE_VERIFY: '/employee-verify',
    HOUR_PER_WEEK: '/hour-per-week',
    HOUR_PER_DAY: '/hour-per-day',
    // PRODUCT
    SUPPLIER_CATALOG: '/supplier-catalog',
    SUPPLIER_CATALOG_UPDATE: '/supplier-catalog/update/:id',
    SUPPLIER_VERIFY: '/supplier-verify',
    PRODUCT_TYPE: '/product-type',
    PRODUCT_GROUP: '/product-group',
    BRAND_CATALOG: '/brand-catalog',
    MANUFACTURER_CATALOG: '/manufacturer-catalog',
    PRODUCT_CATALOG: '/product-catalog',
    PRODUCT_CATALOG_ADD: '/product-catalog/add',
    PRODUCT_CATALOG_UPDATE: '/product-catalog/update/:id',

    // Component UI
    ALERTS: '/alerts',
    BADGES: '/badges',
    BUTTONS: '/buttons',
    BASIC_ELEMENTS: '/basic-elements',
    BASIC_TABLES: '/basic-tables',
    FILE_UPLOADS: '/file-uploads'
} as const
