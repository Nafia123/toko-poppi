import React, {
  ChangeEvent,
  useState,
} from 'react';
import { IdealBankElement, useStripe, useElements } from '@stripe/react-stripe-js';
import fetch from 'node-fetch';
import useTranslation from 'next-translate/useTranslation';
import Modal from 'react-modal';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { DateTime } from 'luxon';
import { ShoppingCartList } from '../../_types/ShoppingCartItem';
// eslint-disable-next-line import/no-absolute-path
import styles from '/styles/Menuitem.module.css';
import { WebShoppingCart } from './ShoppingCart';
import { generateOrderNumber, showCorrectPrice } from '../../utils/helper';
import { Loader } from '../02-molecules/Loader';

const IDEAL_ELEMENT_OPTIONS = {
  // Custom styling can be passed to options when creating an Element
  style: {
    base: {
      backgroundColor: '#ffffff',
      padding: '10px 12px',
      color: '#32325d',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
  },
};

const MODAL_STYLE = {
  backgroundColor: '#ffffff',
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

interface PayFormElements {
  streetName: string,
  houseNumber: string,
  zipcode: string,
  city: string,
  companyName: string,
  firstName: string,
  lastName: string,
  email: string,
  phoneNumber: string,
}

export interface CompanyFormData {
  streetName: string,
  houseNumber: string,
  zipcode: string,
  city: string,
  companyName: string,
}

export default function ViewPayment({
  shoppingCart, setShoppingCart, setCheckout, posFixed, formData = {
    streetName: '',
    houseNumber: '',
    zipcode: '',
    city: '',
    companyName: '',
  },
}: {
  shoppingCart: ShoppingCartList,
  setShoppingCart: React.Dispatch<React.SetStateAction<ShoppingCartList>>,
  setCheckout: React.Dispatch<React.SetStateAction<boolean>>,
  posFixed: boolean,
  formData?: CompanyFormData
}) {
  const [loading, setLoading] = useState(false);
  const [idealChanged, setIdealChanged] = useState(false);
  const [idealError, setIdealError] = useState('');
  const [formState, setFormState] = useState<PayFormElements>({
    ...formData,
    firstName: '',
    email: '',
    lastName: '',
    phoneNumber: '',
  });
  const {
    register, handleSubmit, clearErrors, formState: { errors },
  } = useForm({ defaultValues: formState });
  const stripe = useStripe();
  const { t } = useTranslation('common');
  const elements = useElements();
  const router = useRouter();

  const startPaymentProcess = async () => {
    if (!idealChanged) {
      setIdealError(t('paymentView.personalDetails.errorMessage.ideal'));
      return;
    }
    // event.preventDefault();
    if (!stripe || !elements) {
      return;
    }
    setLoading(true);
    const { orderId, orderNumber } = generateOrderNumber();
    const {
      firstName, lastName, email, phoneNumber,
      houseNumber, streetName, companyName, city, zipcode,
    } = formState;
    const idealBank = elements.getElement(IdealBankElement);
    const accountHolderName = `${firstName} ${lastName}`;
    const orderData = {
      data: {
        email,
        paymentAmount: shoppingCart.totalPrice,
        customerName: accountHolderName,
        customerInformation: {
          fullName: accountHolderName,
          email,
          phoneNumber,
        },
        deliveryInformation: {
          address: [streetName, houseNumber].join(' '),
          zipcode,
          city,
          companyName,
        },
        orderContent: JSON.stringify(shoppingCart.items),
        orderId,
        orderNumber,
        paymentMethod: 'ideal',
      },
    };
    fetch('/api/payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    }).then((res) => res.json()).then(async ({ orderDataRes, clientSecret }) => {
      const { error } = await stripe.confirmIdealPayment(clientSecret, {
        payment_method: {
          ideal: idealBank!,
          billing_details: {
            name: accountHolderName,
          },
        },
        return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/${router.locale}/completed?orderId=${orderId}&recordId=${orderDataRes.data.id}`,
      });
      setLoading(true);
      if (error) {
        console.log(error);
        alert(`Payment could not be completed ${error}`);
        setLoading(false);
      }
    }).catch((e) => {
      console.log(e);
      alert(`Couldn't save data to strapi ${e}`);
      setLoading(false);
    });
  };

  const onSubmit = handleSubmit(startPaymentProcess);
  function handleChange(event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) {
    const { name, value } = event.target;
    clearErrors(name as keyof PayFormElements);
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }
  return (
    <section className="grid grid-cols-5 xl:grid-cols-6">
      <Modal
        style={MODAL_STYLE}
        isOpen={loading}
        className="fixed inset-0"
        contentLabel="Loading"
      >
        <Loader loading={loading} />
      </Modal>
      <section className="col-span-5 lg:col-span-4 xl:col-span-5 shadow-right px-20">
        <div className="mt-4 px-[5%] sm:px-[10%] md:px-[15%] lg:px-5">
          <p className="text-4xl font-bold text-gray-700">{t('paymentView.shippingDetails.labels.pay')}</p>
          <div className="mt-5 px-2 py-4 text-xl text-gray-600">
            <form className="divide-y" onSubmit={onSubmit}>
              <div className={`grid grid-cols-1 lg:grid-cols-2 pb-9 ${styles.payment} rounded-x-lg rounded-t-lg`}>
                <p className="text-4xl pl-4 mb-4 mt-3 font-bold col-span-1 lg:col-span-2">{t('paymentView.shippingDetails.labels.pickupAddress')}</p>
                <div className="ml-5">
                  <p className="text-4xl align-middle mt-1 font-bold">
                    {t('footer.address')}
                    :
                  </p>
                  <p className="text-2xl">Toko Poppi</p>
                  <p className="text-2xl">Bagijnhof 13, 1671CC</p>
                  <p className="text-2xl">Medemblik</p>
                </div>
              </div>
              {/* <div className={`grid grid-cols-1 lg:grid-cols-2 pb-9 ${styles.payment} rounded-x-lg rounded-t-lg`}> */}
              {/*  <div className="px-4 mt-3"> */}
              {/*    <label className="block" htmlFor="streetName"> */}
              {/*      {t('paymentView.shippingDetails.labels.streetName')} */}
              {/*      : */}
              {/*      <span className="text-red-400">*</span> */}
              {/*      <input */}
              {/*        placeholder={t('paymentView.shippingDetails.placeholderText.streetName')} */}
              {/*        disabled={formData.streetName.length !== 0} */}
              {/*        id="streetName" */}
              {/*        {...register('streetName', { required: true })} */}
              {/*        type="text" */}
              {/*        value={formState.streetName} */}
              {/*        onChange={handleChange} */}
              {/*      /> */}
              {/*      { */}
              {/*        errors.streetName ? ( */}
              {/*          <p className="error-message"> */}
              {/*            {t('paymentView.shippingDetails.errorMessage.streetName')} */}
              {/*          </p> */}
              {/*        ) : null */}
              {/*      } */}
              {/*    </label> */}
              {/*  </div> */}
              {/*  <div className="px-4 mt-3"> */}
              {/*    <label className="block" htmlFor="houseNumber"> */}
              {/*      {t('paymentView.shippingDetails.labels.houseNumber')} */}
              {/*      : */}
              {/*      <span className="text-red-400">*</span> */}
              {/*      <input */}
              {/*        placeholder={t('paymentView.shippingDetails.placeholderText.houseNumber')} */}
              {/*        disabled={formData.houseNumber.length !== 0} */}
              {/*        id="houseNumber" */}
              {/*        {...register('houseNumber', { required: true })} */}
              {/*        type="text" */}
              {/*        value={formState.houseNumber} */}
              {/*        onChange={handleChange} */}
              {/*      /> */}
              {/*      { */}
              {/*        errors.houseNumber ? ( */}
              {/*          <p className="error-message"> */}
              {/*            {t('paymentView.shippingDetails.errorMessage.houseNumber')} */}
              {/*          </p> */}
              {/*        ) : null */}
              {/*      } */}
              {/*    </label> */}
              {/*  </div> */}
              {/*  <div className="px-4 mt-3"> */}
              {/*    <label className="block" htmlFor="zipcode"> */}
              {/*      {t('paymentView.shippingDetails.labels.zipCode')} */}
              {/*      : */}
              {/*      <span className="text-red-400">*</span> */}
              {/*      <input */}
              {/*        placeholder={t('paymentView.shippingDetails.placeholderText.zipCode')} */}
              {/*        disabled={formData.zipcode.length !== 0} */}
              {/*        id="zipcode" */}
              {/*        {...register('zipcode', { pattern: /^[1-9][0-9]{3}[A-Z]{2}$/, required: true })} */}
              {/*        type="text" */}
              {/*        value={formState.zipcode} */}
              {/*        onChange={handleChange} */}
              {/*      /> */}
              {/*      { */}
              {/*         errors.zipcode && errors?.zipcode.type === 'pattern' ? ( */}
              {/*           <p className="error-message"> */}
              {/*             {t('paymentView.shippingDetails.errorMessage.invalidZipCode')} */}
              {/*           </p> */}
              {/*         ) : null */}
              {/*      } */}
              {/*      { */}
              {/*        errors.zipcode && errors?.zipcode.type === 'required' ? ( */}
              {/*          <p className="error-message"> */}
              {/*            {t('paymentView.shippingDetails.errorMessage.zipCode')} */}
              {/*          </p> */}
              {/*        ) : null */}
              {/*      } */}
              {/*    </label> */}
              {/*  </div> */}
              {/*  <div className="px-4 mt-3"> */}
              {/*    <label className="block" htmlFor="city"> */}
              {/*      {t('paymentView.shippingDetails.labels.city')} */}
              {/*      : */}
              {/*      <span className="text-red-400">*</span> */}
              {/*      <input */}
              {/*        placeholder={t('paymentView.shippingDetails.placeholderText.city')} */}
              {/*        disabled={formData.city.length !== 0} */}
              {/*        id="city" */}
              {/*        {...register('city', { required: true })} */}
              {/*        type="text" */}
              {/*        value={formState.city} */}
              {/*        onChange={handleChange} */}
              {/*      /> */}
              {/*      { */}
              {/*        errors.city ? ( */}
              {/*          <p className="error-message"> */}
              {/*            {t('paymentView.shippingDetails.errorMessage.city')} */}
              {/*          </p> */}
              {/*        ) : null */}
              {/*      } */}
              {/*    </label> */}
              {/*  </div> */}
              {/*  <div className="px-4 mt-3"> */}
              {/*    <label className="block" htmlFor="companyName"> */}
              {/*      {t('paymentView.shippingDetails.labels.companyName')} */}
              {/*      : */}
              {/*      <input */}
              {/*        placeholder={t('paymentView.shippingDetails.placeholderText.companyName')} */}
              {/*        disabled={formData.companyName.length !== 0} */}
              {/*        id="companyName" */}
              {/*        {...register('companyName')} */}
              {/*        type="text" */}
              {/*        value={formState.companyName} */}
              {/*        onChange={handleChange} */}
              {/*      /> */}
              {/*      { */}
              {/*        errors.companyName ? ( */}
              {/*          <p className="error-message"> */}
              {/*            {t('paymentView.shippingDetails.errorMessage.companyName')} */}
              {/*          </p> */}
              {/*        ) : null */}
              {/*      } */}
              {/*    </label> */}
              {/*  </div> */}
              {/* </div> */}
              <div className={`grid grid-cols-1 lg:grid-cols-2 ${styles.payment} rounded-x-lg rounded-b-lg`}>
                <p className="mt-5 text-2xl pl-4 mb-4 font-bold col-span-1 lg:col-span-2 divide-y-2">{t('paymentView.personalView.labels.personalDetails')}</p>
                <div className="px-4 mt-3">
                  <label className="block" htmlFor="firstName">
                    {t('paymentView.personalView.labels.firstName')}
                    :
                    <span className="text-red-400">*</span>
                    <input
                      placeholder={t('paymentView.personalView.placeholderText.firstName')}
                      id="firstName"
                      {...register('firstName', { required: true })}
                      type="text"
                      value={formState.firstName}
                      onChange={handleChange}
                    />
                    {
                      errors.firstName ? (
                        <p className="error-message">
                          {t('paymentView.personalView.errorMessage.firstName')}
                        </p>
                      ) : null
                    }
                  </label>
                </div>
                <div className="px-4 mt-3">
                  <label className="block" htmlFor="lastName">
                    {t('paymentView.personalView.labels.lastName')}
                    :
                    <span className="text-red-400">*</span>
                    <input
                      placeholder={t('paymentView.personalView.placeholderText.lastName')}
                      id="lastName"
                      {...register('lastName', { required: true })}
                      type="text"
                      value={formState.lastName}
                      onChange={handleChange}
                    />
                    {
                      errors.lastName ? (
                        <p className="error-message">
                          {t('paymentView.personalView.errorMessage.lastName')}
                        </p>
                      ) : null
                    }
                  </label>
                </div>
                <div className="px-4 mt-3">
                  <label className="block" htmlFor="email">
                    {t('paymentView.personalView.labels.email')}
                    :
                    <span className="text-red-400">*</span>
                    <input
                      className={`${formState.email.length !== 0 && 'invalid:border-red-500'} `}
                      placeholder={t('paymentView.personalView.placeholderText.email')}
                      id="email"
                      {...register('email', { required: true })}
                      type="email"
                      value={formState.email}
                      onChange={handleChange}
                    />
                    {
                      errors.email ? (
                        <p className="error-message">
                          {t('paymentView.personalView.errorMessage.email')}
                        </p>
                      ) : null
                    }
                  </label>
                </div>
                <div className="px-4 mt-3">
                  <label className="block" htmlFor="phoneNumber">
                    {t('paymentView.personalView.labels.phoneNumber')}
                    :
                    <span className="text-red-400">*</span>
                    <input
                      placeholder={t('paymentView.personalView.placeholderText.phoneNumber')}
                      id="phoneNumber"
                      {...register('phoneNumber', {
                        pattern: /(^\+[0-9]{2}|^\+[0-9]{2}\(0\)|^\(\+[0-9]{2}\)\(0\)|^00[0-9]{2}|^0)([0-9]{9}$|[0-9\-\s]{10}$)/,
                        required: true,
                      })}
                      type="number"
                      value={formState.phoneNumber}
                      onChange={handleChange}
                    />
                    {
                      errors.phoneNumber && errors.phoneNumber.type === 'pattern' ? (
                        <p className="error-message">
                          {t('paymentView.personalView.errorMessage.invalidPhoneNumber')}
                        </p>
                      ) : null
                    }
                    {
                     errors.phoneNumber && errors.phoneNumber.type === 'required' ? (
                       <p className="error-message">
                         {t('paymentView.personalView.errorMessage.phoneNumber')}
                       </p>
                     ) : null
                    }
                  </label>
                </div>
                <div className="px-4 mt-3">
                  <div>
                    {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                    <label htmlFor="ideal">
                      iDeal Bank
                      <IdealBankElement className="my-3" id="ideal" onChange={() => setIdealChanged(true)} options={IDEAL_ELEMENT_OPTIONS} />
                      {
                        idealError ? (
                          <p className="error-message mb-4">
                            {t('paymentView.personalView.errorMessage.ideal')}
                          </p>
                        ) : null
                      }
                    </label>
                  </div>
                </div>
              </div>
              <button disabled={!stripe} type="submit" className="mt-5 text-white bg-blue-600  hover:bg-blue-700 border-blue-600 disabled:bg-blue-300 disabled:border-blue-300 p-2 w-full lg:w-1/2">
                {t('paymentView.shippingDetails.labels.finishButton')}
                {' '}
                (
                {showCorrectPrice(shoppingCart.totalPrice)}
                )
              </button>
            </form>
          </div>
        </div>
      </section>
      <section className="w-full">
        <div className={`invisible lg:visible h-screen lg:h-1/2 ${posFixed ? 'fixed top-0 w-1/5 xl:w-1/6' : ''}`}>
          <WebShoppingCart
            shoppingItems={shoppingCart}
            setCheckout={setCheckout}
            setShoppingCart={setShoppingCart}
            showPayButton={false}
          />
        </div>
      </section>
    </section>
  );
}
