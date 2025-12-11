import { useMutation, useQuery } from "@tanstack/react-query"
import { useFormik } from 'formik'
import { Col, Container, Form, Row } from 'react-bootstrap'
import { FaLocationDot, FaPhone } from "react-icons/fa6"
import { IoMdMail } from "react-icons/io"
import "react-international-phone/style.css"
import { isValidPhoneNumber, parsePhoneNumber } from "react-phone-number-input"
import { Link, useNavigate } from 'react-router-dom'
import * as yup from "yup"
import Footer from '../component/Footer'
import Header from '../component/Header'
import { addContactuS, getContactDirectoryListAdmin } from '../services/services'
import { toastAlert } from '../utils/SweetAlert'
import { emailRegex } from '../utils/helper'
import { PhoneInput } from "react-international-phone";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa"

function ContactUs() {

    const navigate = useNavigate();

    /**
      * Handles add/edit contact us mutation and post-success actions.
      */
    const { mutate } = useMutation({
        mutationFn: (body) => addContactuS(body),
        onSuccess: (resp) => {
            toastAlert("success", resp?.data?.message);
            addContactFormik?.resetForm();
            navigate(`/`);
        },
    });

    /**
     * Initializes Formik for the add contact us form.
     */
    const addContactFormik = useFormik({
        initialValues: {
            fullName: "",
            email: "",
            countryCode: "",
            phoneNumber: "",
            message: ""
        },
        validationSchema: yup.object().shape({
            fullName: yup.string().trim().required().label("Full name"),
            email: yup.string().required().label("Email").matches(emailRegex, "Invalid email").trim(),
            message: yup.string().trim().required().label("Message"),
            phoneNumber: yup
                .string()
                .min(7, "Phone Number is a required field")
                .test("phone-validate", "Invalid phone number", function (value) {
                    if (value?.length > 6) {
                        return isValidPhoneNumber(String(value));
                    } else {
                        return true;
                    }
                })
                .required("Phone Number is a required field"),
        }),
        onSubmit: async (values) => {
            let number = parsePhoneNumber(String(values?.phoneNumber));
            let body;
            body = {
                fullName: values?.fullName,
                email: values?.email,
                message: values?.message,
                phoneNumber: number?.nationalNumber ?? "",
                countryCode: number?.countryCallingCode ? "+" + number?.countryCallingCode : "",
            }
            mutate(body);
        },
    });

    const { data } = useQuery({
        queryKey: ["contact-data"],
        queryFn: async () => {
            const resp = await getContactDirectoryListAdmin();
            return resp?.data?.data ?? "";
        },
    });

    return (
        <>
            <Header />
            <section className="breadcrum-main">
                <Container>
                    <Row>
                        <Col lg={12}>
                            <div className="breadcrum-text text-center">
                                <h1 className="text-capitalize">contact Us</h1>
                                <ul className="d-flex align-items-center gap-2 justify-content-center mb-0">
                                    <li>
                                        <Link to="/" className='text-capitalize'>Home</Link>
                                    </li>
                                    <li>/</li>
                                    <li className='text-capitalize'>contact Us</li>
                                </ul>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>
            {/* CONATCT INFO */}
            <section className="contact-info py-80 position-relative">
                <div className="position-absolute inset-0 cosmic-bg"></div>
                <Container>
                
                   
                </Container>
            </section>
            {/* CONTACT FORM */}
            <section className="contact-form position-relative py-80 pt-0">
                <div className="position-absolute inset-0 cosmic-bg"></div>
                <Container>
                  
                        <Row>
                            <Col lg={5} className='mb-lg-0 mb-4'>
                            <Row>
                        <Col lg={12} className='mb-lg-0 mb-4'>
                            <div className="contact-box">
                                <div className="contact-icon">
                                    <FaPhone />
                                </div>
                                <div className="contact-txt ">
                                    <h5 className='text-capitalize'>phone number</h5>
                                    <div className='d-flex aling-items-center flex-column'>
                                        <Link to={`tel:${data?.countryCode}${data?.mobile}`}>{data?.countryCode && data?.countryCode + " " + data?.mobile}</Link>
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col lg={12} className='mb-lg-0 mb-4'>
                            <div className="contact-box">
                                <div className="contact-icon">
                                    <IoMdMail />
                                </div>
                                <div className="contact-txt">
                                    <h5 className='text-capitalize'>email</h5>
                                    <div className='d-flex aling-items-center flex-column'>
                                        <Link to={`mailto:${data?.email}`}>{data?.email ?? ""}</Link>
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col lg={12} className='mb-lg-0 mb-4'>
                            <div className="contact-box">
                                <div className="contact-icon">
                                    <FaLocationDot />
                                </div>
                                <div className="contact-txt">
                                    <h5 className='text-capitalize'>address</h5>
                                    <div className='d-flex aling-items-center flex-column'>
                                        <p className='mb-0'>{data?.address ?? ""}</p>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                            </Col>
                            <Col lg={7}>
                                <Form className='contact_form '>
                                    <Row>
                                        <Col lg={6}>
                                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                                <Form.Label>Fullname<span className="text-danger"> *</span></Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Enter Full name "
                                                    name="fullName"
                                                    value={addContactFormik?.values?.fullName}
                                                    onChange={addContactFormik?.handleChange}
                                                    onBlur={addContactFormik?.handleBlur}
                                                    maxLength={50}
                                                />
                                                <span className="text-danger">{addContactFormik?.touched?.fullName && addContactFormik?.errors?.fullName}</span>

                                            </Form.Group>
                                        </Col>
                                        <Col lg={6}>
                                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                                <Form.Label>Email address <span className="text-danger"> *</span></Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Enter email"
                                                    name="email"
                                                    value={addContactFormik?.values?.email}
                                                    onChange={addContactFormik?.handleChange}
                                                    onBlur={addContactFormik?.handleBlur}
                                                    maxLength={60}
                                                />
                                                <span className="text-danger">{addContactFormik?.touched?.email && addContactFormik?.errors?.email}</span>
                                            </Form.Group>
                                        </Col>
                                        <Col lg={12}>
                                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                                <Form.Label> Phone Number <span className="text-danger"> *</span></Form.Label>
                                                <PhoneInput
                                                    defaultCountry="in"
                                                    placeholder="Enter phone number"
                                                    value={addContactFormik?.values?.phoneNumber}
                                                    onChange={(value) => {
                                                        addContactFormik?.setFieldValue("phoneNumber", value);
                                                    }}
                                                />
                                                <span className="text-danger">{addContactFormik?.touched?.phoneNumber && addContactFormik?.errors?.phoneNumber}</span>
                                            </Form.Group>
                                        </Col>
                                        <Col lg={12}>
                                            <Form.Group className="mb-3 pb-2" controlId="exampleForm.ControlTextarea1">
                                                <Form.Label>Message <span className="text-danger"> *</span></Form.Label>
                                                <Form.Control as="textarea" rows={3} type="text"
                                                    placeholder="Enter Message"
                                                    name="message"
                                                    value={addContactFormik?.values?.message}
                                                    onChange={addContactFormik?.handleChange}
                                                    onBlur={addContactFormik?.handleBlur}
                                                    maxLength={300} />
                                                <span className="text-danger">{addContactFormik?.touched?.message && addContactFormik?.errors?.message}</span>

                                            </Form.Group>
                                        </Col>
                                        <Col lg={12}>
                                            <div className="main-btn">
                                                <button type="submit"
                                                    onClick={addContactFormik?.handleSubmit} className='theme-btn w-100 text-capitalize'>submit</button>
                                            </div>
                                        </Col>
                                    </Row>
                                </Form>
                            </Col>
                        </Row>
                    
                </Container>
            </section>
            {/* MAP SECTION */}
            <section className="map-sec py-0">
                <Container fluid>
                    <Row>
                        <Col lg={12} className='px-0'>
                            <div className="map-box">
                                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3430.185720877124!2d76.70709767627127!3d30.7131788865761!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390f954ea4b2c735%3A0x44c7b39d86228a72!2sToXSL%20Technologies!5e0!3m2!1sen!2sin!4v1752476800147!5m2!1sen!2sin" allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>
            <Footer />
        </>
    )
}

export default ContactUs
