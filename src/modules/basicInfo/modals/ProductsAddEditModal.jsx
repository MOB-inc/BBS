/* eslint-disable react/prop-types */
import {
  CCol,
  CForm,
  CInput,
  CLabel,
  CModal,
  CModalBody,
  CRow,
} from '@coreui/react';
import Select, { components } from 'react-select';
import { useDropzone } from 'react-dropzone';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Loading from '../../../commons/components/Loading';
import { ReactComponent as DeleteIcon } from '../../../commons/icons/delete.svg';
import { ReactComponent as ArrowDown } from '../../../commons/icons/arrow-down.svg';
import './product_item_modal.scss';
import { productAddURLTypeButtonOptions } from '../../../commons/constants/lists';
import {
  isLengthValid,
  isOnlyNumber,
} from '../../../commons/helpers/validation';

const customStyles = {
  control: () => ({
    width: '100%',
    border: '1px solid #828282',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '32px',
  }),
};

const ProductAddEditModal = ({
  modal,
  edit,
  closeModal,
  currentRow,
  categories,
  openDeleteModal,
  setProductItems,
  setCategoryList,
}) => {
  const {
    t,
    i18n: { language },
  } = useTranslation(['basic_info']);

  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState([]);
  const [imageWidth, setImageWidth] = useState();
  const [imageHeight, setImageHeight] = useState();
  const [productName, setProductName] = useState('');
  const [productDesc, setProductDesc] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [buttonLink, setButtonLink] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [productButtonType, setProductButtonType] = useState({});
  const [productCategory, setProductCategory] = useState({
    value: 0,
    label: 'Add new category',
  });

  const [isProductNameValid, setProductNameValid] = useState(true);
  const [isProductDescValid, setProductDescValid] = useState(true);
  const [isProductCostValid, setProductCostValid] = useState(true);
  const [isProductLinkValid, setProductLinkValid] = useState(true);

  const handleInputChange = (evt, type) => {
    evt.preventDefault();
    if (type === 1) {
      if (isLengthValid(evt.target.value)) {
        setProductNameValid(true);
        setProductName(evt.target.value);
      } else {
        setProductNameValid(false);
      }
    } else if (type === 2) {
      setNewCategory(evt.target.value);
    } else if (type === 3) {
      if (isLengthValid(evt.target.value)) {
        setProductDescValid(true);
        setProductDesc(evt.target.value);
      } else {
        setProductDescValid(false);
      }
    } else if (type === 4) {
      const number = evt.target.value.replace(/,/g, '');
      if (isOnlyNumber(number) && number.length <= 8) {
        setProductPrice(number);
        setProductCostValid(true);
      } else {
        setProductCostValid(false);
      }
    } else if (type === 5) {
      if (isLengthValid(evt.target.value)) {
        setProductLinkValid(true);
        setButtonLink(evt.target.value);
      } else {
        setProductLinkValid(false);
      }
    }
  };

  const setDefaultPriceType = () => {
    setProductButtonType({
      value: Object.values(productAddURLTypeButtonOptions[0])[1],
      label: Object.values(productAddURLTypeButtonOptions[0])[
        language === 'en' ? 2 : 3
      ],
    });
  };

  const clear = () => {
    setImageFile([]);
    setImageWidth();
    setImageHeight();
    setProductName('');
    setProductDesc('');
    setProductPrice('');
    setDefaultPriceType();
    setProductCategory({ value: 0, label: 'Add new category' });
    setButtonLink('');
    setProductButtonType(productAddURLTypeButtonOptions[0]);
  };

  const handleProductDelete = async (event) => {
    event.preventDefault();
    openDeleteModal();
    closeModal();
  };

  const openHandler = () => {
    if (edit) {
      setImageFile(currentRow.imgFile);
      setProductName(currentRow.name);
      setProductCategory(
        categories.filter((item) => item.value === currentRow.category)[0],
      );
      setProductDesc(currentRow.description);
      setProductPrice(currentRow.price);
      setProductButtonType(
        productAddURLTypeButtonOptions
          .filter((item) => item.value === currentRow.button_type)
          .map((item) => ({
            value: item.value,
            label: language === 'en' ? item.en_name : item.name,
          }))[0],
      );
      setButtonLink(currentRow.button_link);
    } else {
      clear();
    }
  };

  const DropdownIndicator = (props) => {
    return (
      <components.DropdownIndicator {...props}>
        <ArrowDown />
      </components.DropdownIndicator>
    );
  };

  const onDrop = useCallback((acceptedFiles) => {
    setImageFile([...imageFile, ...acceptedFiles]);
    const img = new Image();
    img.src = window.URL.createObjectURL(acceptedFiles[0]);
    img.onload = () => {
      setImageWidth(img.width);
      setImageHeight(img.height);
    };
  }, []);
  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    noClick: true,
    maxFiles: 1,
    accept: 'image/jpeg, image/png, image/jpg',
  });
  const files =
    imageFile &&
    imageFile.map((file) => (
      <>
        <p key={file.path}>
          {file.path} - {file.size} bytes
        </p>
        <p>
          Width: {imageWidth} - Height: {imageHeight}
        </p>
      </>
    ));

  const checkValidation = () => {
    return true;
  };

  const createNewCategory = async () => {
    // const newCategory = await createNewCategory();
    setCategoryList((prevState) => [
      ...prevState,
      {
        value: Math.max(prevState.map((i) => i.value)) + 1,
        label: newCategory,
      },
    ]);
  };

  const handleAddServiceItem = async (event) => {
    try {
      setLoading(true);
      event.preventDefault();
      if (checkValidation()) {
        if (productCategory.value === 0) {
          createNewCategory();
        }

        const newItem = {
          imgFile: imageFile,
          name: productName,
          category:
            productCategory.value === 0 ? newCategory : productCategory.value,
          description: productDesc,
          price: productPrice,
          button_type: productButtonType.value,
          button_link: buttonLink,
        };
        setProductItems((prevState) => [
          ...prevState,
          { ...newItem, id: Math.max(prevState.map((itm) => itm?.id)) + 1 },
        ]);
        clear();
        closeModal();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEditService = async (event) => {
    try {
      setLoading(true);
      event.preventDefault();
      const editedItems = {
        imgFile: imageFile,
        name: productName,
        category:
          productCategory.value === 0 ? newCategory : productCategory.value,
        description: productDesc,
        price: productPrice,
        button_type: productButtonType.value,
        button_link: buttonLink,
        id: currentRow.id,
      };

      setProductItems((prevState) => {
        return prevState.map((item) => {
          if (item.id === currentRow.id) {
            return editedItems;
          }
          return item;
        });
      });
      // await editMenuItem({
      //   menu_id: menuId,
      //   category_id: categoryId,
      //   name: title || currentRow.name,
      //   description: subtitle || currentRow.description,
      //   price: cost || currentRow.price,
      // });
      // if (editResponse.ok) {
      //   const data = menuItemList;
      //   const oldData = currentRow;
      //   const newData = {};
      //   newData.id = oldData.id;
      //   newData.name = title || oldData.name;
      //   newData.description = subtitle || oldData.description;
      //   newData.price = cost || oldData.price;
      //   newData.created_at = oldData.created_at;
      //   newData.updated_at = oldData.updated_at;
      //   if (oldData) {
      //     data[data.indexOf(oldData)] = newData;
      //     addingItem(data, 2);
      //     clear();
      //     closeModal();
      //   }
      // }
      clear();
      closeModal();
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Loading loading={loading} />
      {modal ? (
        <CModal
          centered
          show
          onClose={closeModal}
          onOpened={openHandler}
          className="product-item-modal"
        >
          <CModalBody>
            <CForm action="" method="post" className="form-horizontal">
              <CRow>
                <CCol md="12">
                  <div className="photo-display-portion" {...getRootProps()}>
                    <input {...getInputProps()} />
                    <p className="image-msg msg-margin">
                      {t('basic_info:IMAGE_TAB.MSG_1')}
                    </p>
                    <p className="image-msg">
                      {t('basic_info:IMAGE_TAB.MSG_2')}
                    </p>
                    <button
                      type="button"
                      className="upload-button"
                      onClick={open}
                    >
                      {t('basic_info:IMAGE_TAB.SELECT_PHOTO_BUTTON')}
                    </button>
                    <div>{files}</div>
                  </div>
                </CCol>
              </CRow>
              <CRow>
                <CCol md="1" />
                <CCol md="10" className="padding-label">
                  <CLabel className="input-label">
                    {t('basic_info:PRODUCTS.NAME_LABEL')}
                  </CLabel>
                </CCol>
                <CCol md="1" />
              </CRow>
              <CRow>
                <CCol md="1" />
                <CCol md="10" className="padding-left-right">
                  <CInput
                    className="common-input"
                    onChange={(evt) => handleInputChange(evt, 1)}
                    value={productName}
                  />
                  {/* {!isNameValid ? (
                    <p className="error-message">
                      {t('basic_info:BASIC_INFO.ERROR_LENGTH')}
                    </p>
                  ) : (
                    <></>
                  )} */}
                </CCol>
                <CCol md="1" />
              </CRow>
              <CRow>
                <CCol md="1" />
                <CCol md="10" className="padding-label">
                  <CLabel className="input-label">
                    {t('basic_info:PRODUCTS.CATEGORY_LABEL')}
                  </CLabel>
                </CCol>
                <CCol md="1" />
              </CRow>
              <CRow>
                <CCol md="1" />
                <CCol md="10" className="padding-left-right">
                  <div className="select-price-types">
                    <Select
                      closeMenuOnSelect
                      styles={customStyles}
                      options={categories}
                      value={productCategory}
                      components={{ DropdownIndicator }}
                      onChange={(event) =>
                        setProductCategory(
                          categories.filter((i) => i.value === event.value)[0],
                        )
                      }
                    />
                  </div>
                </CCol>
                <CCol md="1" />
              </CRow>
              {productCategory.value === 0 ? (
                <CRow>
                  <CCol md="1" />
                  <CCol
                    md="10"
                    className="padding-left-right custom-margin-top"
                  >
                    <CInput
                      className="common-input"
                      onChange={(evt) => handleInputChange(evt, 2)}
                    />
                  </CCol>
                  <CCol md="1" />
                </CRow>
              ) : (
                <></>
              )}
              <CRow>
                <CCol md="1" />
                <CCol md="10" className="padding-label">
                  <CLabel className="input-label">
                    {t('basic_info:PRODUCTS.DESCRIPTION_LABEL')}
                  </CLabel>
                </CCol>
                <CCol md="1" />
              </CRow>
              <CRow>
                <CCol md="1" />
                <CCol md="10" className="padding-left-right">
                  <CInput
                    className="common-input"
                    onChange={(evt) => handleInputChange(evt, 3)}
                    value={productDesc}
                  />
                  {/* {!isDescValid ? (
                    <p className="error-message">
                      {t('basic_info:BASIC_INFO.ERROR_LENGTH')}
                    </p>
                  ) : (
                    <></>
                  )} */}
                </CCol>
                <CCol md="1" />
              </CRow>
              <CRow>
                <CCol md="1" />
                <CCol md="10" className="padding-label">
                  <CLabel className="input-label">
                    {t('basic_info:PRODUCTS.PRICE_LABEL')}
                  </CLabel>
                </CCol>
                <CCol md="1" />
              </CRow>
              <CRow>
                <CCol md="1" />
                <CCol md="10" className="padding-left-right">
                  <CInput
                    className="common-input"
                    onChange={(evt) => handleInputChange(evt, 4)}
                    value={productPrice}
                  />
                  {/* {!isDescValid ? (
                    <p className="error-message">
                      {t('basic_info:BASIC_INFO.ERROR_LENGTH')}
                    </p>
                  ) : (
                    <></>
                  )} */}
                </CCol>
                <CCol md="1" />
              </CRow>
              <CRow>
                <CCol md="1" />
                <CCol md="4" className="padding-label">
                  <CLabel className="input-label">
                    {t('basic_info:PRODUCTS.BUTTON_LABEL')}
                  </CLabel>
                </CCol>
                <CCol md="1" />
                <CCol md="4" className="padding-label-custom">
                  <CLabel className="input-label-custom">
                    {t('basic_info:PRODUCTS.LINK_LABEL')}
                  </CLabel>
                </CCol>
                <CCol md="1" />
              </CRow>
              <CRow>
                <CCol md="1" />
                <CCol md="5" className="padding-left-right">
                  <div className="select-price-types">
                    <Select
                      closeMenuOnSelect
                      styles={customStyles}
                      options={
                        productAddURLTypeButtonOptions.map((i) => ({
                          value: i.value,
                          label: language === 'en' ? i.en_name : i.name,
                        })) || []
                      }
                      value={productButtonType}
                      components={{ DropdownIndicator }}
                      onChange={(event) =>
                        setProductButtonType(
                          productAddURLTypeButtonOptions
                            .filter((i) => i.value === event.value)
                            .map((i) => ({
                              value: i.value,
                              label: language === 'en' ? i.en_name : i.name,
                            }))[0],
                        )
                      }
                    />
                  </div>
                </CCol>
                <CCol md="5" className="padding-left-right-custom">
                  <CInput
                    type="url"
                    className="common-input-custom"
                    onChange={(evt) => handleInputChange(evt, 5)}
                    value={buttonLink}
                  />
                  {/* {!isCostValid ? (
                    <p className="error-message">
                      {t('basic_info:BASIC_INFO.ERROR_NUMBER')}
                    </p>
                  ) : (
                    <></>
                  )} */}
                </CCol>
                <CCol md="1" />
              </CRow>
              <CRow>
                <CCol xs="3" />
                <CCol xs="6">
                  <button
                    type="submit"
                    color="primary"
                    className="px-4 success-button"
                    onClick={edit ? handleEditService : handleAddServiceItem}
                    disabled={
                      !isProductNameValid ||
                      !isProductDescValid ||
                      !isProductCostValid ||
                      !isProductLinkValid ||
                      productButtonType === null
                    }
                  >
                    {edit
                      ? t('basic_info:SERVICES.REGISTRATION')
                      : t('basic_info:MENU.CREATE')}
                  </button>
                </CCol>
                <CCol xs="3" />
              </CRow>
              <CRow>
                <CCol xs="3" />
                <CCol xs="6">
                  <button
                    type="button"
                    color="primary"
                    className="px-4 cancel-button"
                    onClick={closeModal}
                  >
                    {t('basic_info:MENU.COMMON_RETURN')}
                  </button>
                </CCol>
                <CCol xs="3" />
              </CRow>
              {edit ? (
                <div className="delete-icon">
                  <DeleteIcon
                    height={15}
                    width={15}
                    onClick={(event) => handleProductDelete(event)}
                  />
                </div>
              ) : (
                <></>
              )}
            </CForm>
          </CModalBody>
        </CModal>
      ) : (
        <></>
      )}
    </>
  );
};

export default ProductAddEditModal;
