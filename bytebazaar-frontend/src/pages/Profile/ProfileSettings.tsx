import { Form, Button, Row, Col } from "react-bootstrap";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../reducers/UserContext.tsx";
import { UpdateUserProfile } from "../../reducers/AuthProvider.tsx";

function ProfileSettings() {
    const { user } = useContext(UserContext);

    const [formData, setFormData] = useState<{ [key: string]: any }>({});
    const [formResponse, setFormResponse] = useState<{
        type: "success" | "error";
        message: string;
    }>();

    const isSeller = user?.roles?.some((role: any) => role.name === "seller");

    useEffect(() => {
        const sellerProfile = user?.sellerProfile || {};

        setFormData({
            // --- User fields ---
            fullname: user?.fullname || "",
            username: user?.username || "",
            email: user?.email || "",
            phone: user?.phone || "",
            dob: user?.dob ? user.dob.split("T")[0] : "",
            gender: user?.gender || "",
            address: user?.address || "",
            profileImage: null,
            password: "",
            confirmPassword: "",

            // --- Seller fields (from sellerProfile if exists) ---
            shopName: sellerProfile?.shopName || "",
            businessType: sellerProfile?.businessType || "",
            businessCategory: sellerProfile?.businessCategory || "",
            businessAddress: sellerProfile?.businessAddress || "",
            cnic: sellerProfile?.cnic || "",
            bankAccountTitle: sellerProfile?.bankAccountTitle || "",
            bankAccountNumber: sellerProfile?.bankAccountNumber || "",
            bankName: sellerProfile?.bankName || "",
            bankBranch: sellerProfile?.bankBranch || "",
            emergencyContact: sellerProfile?.emergencyContact || "",
            status: sellerProfile?.status || "pending",
        });
    }, [user]);

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value, files } = e.target as any;
        setFormData({
            ...formData,
            [name]: files ? files[0] : value,
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const frmData = new FormData();
        for (let key in formData) {
            if (formData[key] && formData[key].length > 0 && formData[key].item) {
                Array.from(formData[key]).forEach((file) => {
                    frmData.append(key, file);
                });
            } else {
                frmData.append(key, formData[key]);
            }
        }

        UpdateUserProfile(formData)
            .then((res) => {
                setFormResponse({
                    type: "success",
                    message: res.data.message,
                });
            })
            .catch((err) => {
                setFormResponse({
                    type: "error",
                    message: err.message || "Failed to update profile",
                });
            });
    };

    return (
        <div className="profile-settings">
            <h3 className="mb-4">Profile Settings</h3>
            <Form onSubmit={handleSubmit}>
                {/* Generic User Fields */}
                <Row>
                    <Col md={12}>
                        <Form.Group className="mb-3" controlId="fullname">
                            <Form.Label>Full Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="fullname"
                                value={formData.fullname}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3" controlId="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3" controlId="phone">
                            <Form.Label>Phone</Form.Label>
                            <Form.Control
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3" controlId="dob">
                            <Form.Label>Date of Birth</Form.Label>
                            <Form.Control
                                type="date"
                                name="dob"
                                value={formData.dob}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3" controlId="gender">
                            <Form.Label>Gender</Form.Label>
                            <Form.Select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                            >
                                <option value="">Select gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>

                <Form.Group className="mb-3" controlId="address">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={2}
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="profileImage">
                    <Form.Label>Profile Image</Form.Label>
                    <Form.Control
                        type="file"
                        name="profileImage"
                        onChange={handleChange}
                        accept=".jpeg,.jpg,.png"
                    />
                </Form.Group>

                {/* Seller-Only Fields */}
                {isSeller && (
                    <>
                        <h4 className="mt-4">Seller Information</h4>

                        <Form.Group className="mb-3" controlId="shopName">
                            <Form.Label>Shop Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="shopName"
                                value={formData.shopName}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3" controlId="businessType">
                                    <Form.Label>Business Type</Form.Label>
                                    <Form.Select
                                        name="businessType"
                                        value={formData.businessType}
                                        onChange={handleChange}
                                    >
                                        <option value="">Select</option>
                                        <option value="individual">Individual</option>
                                        <option value="sole_proprietorship">
                                            Sole Proprietorship
                                        </option>
                                        <option value="company">Company</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3" controlId="businessCategory">
                                    <Form.Label>Business Category</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="businessCategory"
                                        value={formData.businessCategory}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3" controlId="businessAddress">
                            <Form.Label>Business Address</Form.Label>
                            <Form.Control
                                type="text"
                                name="businessAddress"
                                value={formData.businessAddress}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="cnic">
                            <Form.Label>CNIC</Form.Label>
                            <Form.Control
                                type="text"
                                name="cnic"
                                value={formData.cnic}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3" controlId="bankAccountTitle">
                                    <Form.Label>Bank Account Title</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="bankAccountTitle"
                                        value={formData.bankAccountTitle}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3" controlId="bankAccountNumber">
                                    <Form.Label>Bank Account Number</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="bankAccountNumber"
                                        value={formData.bankAccountNumber}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3" controlId="bankName">
                                    <Form.Label>Bank Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="bankName"
                                        value={formData.bankName}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3" controlId="bankBranch">
                                    <Form.Label>Bank Branch</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="bankBranch"
                                        value={formData.bankBranch}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3" controlId="emergencyContact">
                            <Form.Label>Emergency Contact</Form.Label>
                            <Form.Control
                                type="text"
                                name="emergencyContact"
                                value={formData.emergencyContact}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </>
                )}

                {/* Password Change */}
                <h5 className="mt-4">Change Password</h5>
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3" controlId="password">
                            <Form.Label>New Password</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3" controlId="confirmPassword">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Button variant="primary" type="submit" className="mt-3">
                    Save Changes
                </Button>

                <div className="form-response-message mt-2">
          <span
              className={
                  formResponse?.type === "success" ? "text-success" : "text-danger"
              }
          >
            {formResponse?.message}
          </span>
                </div>
            </Form>
        </div>
    );
}

export default ProfileSettings;
