/**
@copyright : ToXSL Technologies Pvt. Ltd. < www.toxsl.com >
@author     : Shiv Charan Panjeta < shiv@toxsl.com >

All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of ToXSL Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/

module.exports = function (app) {
  /*Routes for auth*/
  app.post("/auth/signup", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['USER-AUTHENTICATION']
            #swagger.description = 'Endpoint to signup a user.' */

    /*  #swagger.parameters['obj'] = {
                           in: 'body',
                           description: 'Some description...',
                           schema: {
                                  $fullName: "john smith",
                                  $email:"john@in.in",
                                  $countryCode:"+91",
                                  $mobile:"2525252525",
                                  $dob:"05-10-2000",
                                  $gender:"1",
                                  $password:"Admin@123",
                                  $IOSCode:"IN",
                                  $roleId:3

                           }
                   } */
    if (expression) {
      // #swagger.responses[201] = { description: 'User Signup Successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/auth/verifyOtp", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['USER-AUTHENTICATION']
                            #swagger.description = 'Endpoint to signup a user.' */

    /*  #swagger.parameters['obj'] = {
                           in: 'body',
                           description: 'Some description...',
                           schema: {
                                  $email: "",
                                  $otp:"",
                                  $mobile:"",
                                  $countryCode:""
                           }
                   } */

    if (expression) {
      // #swagger.responses[201] = { description: 'Otp verified successfully' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/auth/resendOtp", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['USER-AUTHENTICATION']
                        #swagger.description = 'Endpoint to resend Otp .' */

    /*  #swagger.parameters['obj'] = {
                       in: 'body',
                       description: 'Some description...',
                       schema: {
                               $email: "john@in.in",
                               $mobile:"2525252525",
                               $countryCode:"+91"
                              
                       }
               } */
    if (expression) {
      // #swagger.responses[201] = { description: 'Otp resend successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.post("/auth/login", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['USER-AUTHENTICATION']
                                #swagger.description = 'Endpoint to signup a user.' */

    /*  #swagger.parameters['obj'] = {
                               in: 'body',
                               description: 'Some description...',
                               schema: {
                                      $email: "",
                                      $password: "",
                                      $roleId: 1
                               }
                       } */

    if (expression) {
      // #swagger.responses[201] = { description: 'User SignIn Successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.post("/auth/userLogin", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['USER-AUTHENTICATION']
                                #swagger.description = 'Endpoint to signup a user.' */

    /*  #swagger.parameters['obj'] = {
                               in: 'body',
                               description: 'Some description...',
                               schema: {
                                      $email: "john@in.in",
                                      $mobile: "2525252525",
                                      $countryCode: "+91",
                                      $password: "Admin@123",
                                      $roleId:"3",
                                      $deviceName:"ios",
                                      $deviceToken:"123",
                                      $deviceType:1
                               }
                       } */

    if (expression) {
      // #swagger.responses[201] = { description: 'User SignIn Successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/auth/forgotPassword", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['USER-AUTHENTICATION']
                            #swagger.description = 'Endpoint to signup a user.' */

    /*  #swagger.parameters['obj'] = {
                           in: 'body',
                           description: 'Some description...',
                           schema: {
                                  $email: "",
                                  $mobile: "",
                                  $countryCode: ""
                           }
                   } */

    if (expression) {
      // #swagger.responses[201] = { description: 'Otp has been send to your phone no.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/auth/resetPassword", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['USER-AUTHENTICATION']
                            #swagger.description = 'Endpoint to signup a user.' */

    /*  #swagger.parameters['obj'] = {
                           in: 'body',
                           description: 'Some description...',
                           schema: {
                                  $email: "",
                                  $password:"",
                                  $mobile: "",
                                  $countryCode: ""
                           }
                   } */

    if (expression) {
      // #swagger.responses[201] = { description: 'Otp has been send to your phone no.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/auth/changePassword", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['USER-AUTHENTICATION']
                            #swagger.description = 'Endpoint to signup a user.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /*  #swagger.parameters['obj'] = {
                           in: 'body',
                           description: 'Some description...',
                           schema: {
                                  $oldPassword: "",
                                  $password: "",
                           }
                   } */

    if (expression) {
      // #swagger.responses[201] = { description: 'User Change Password Successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/auth/profile", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['USER-AUTHENTICATION']
                            #swagger.description = 'Endpoint to signup a user.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'User Found Successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/auth/editProfile", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['USER-AUTHENTICATION']
                            #swagger.description = 'Endpoint to edit user detail.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /*
          #swagger.consumes = ['multipart/form-data'] 
                #swagger.parameters['profileImg'] = {
                 in: 'formData',
                 type: 'file',
                 description: 'profileImg',
             }  

                #swagger.parameters['frontImg'] = {
                 in: 'formData',
                 type: 'file',
                 description: 'frontImg',
             }  

                #swagger.parameters['backImg'] = {
                 in: 'formData',
                 type: 'file',
                 description: 'backImg',
             }  


                #swagger.parameters['liveSelfyImg'] = {
                 in: 'formData',
                 type: 'file',
                 description: 'liveSelfyImg',
             }  

             #swagger.parameters['fullName'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter fullName',
             }

               #swagger.parameters['countryCode'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter countryCode',
             }

              #swagger.parameters['mobile'] = {
                 in: 'formData',
                 type: 'number',
                 description: 'Enter mobile',
             }

              #swagger.parameters['IOSCode'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter IOSCode',
             }
            
             #swagger.parameters['gender'] = {
                 in: 'formData',
                 type: 'number',
                 description: 'gender',     
             }
                  #swagger.parameters['dob'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'dob',     
             }

              #swagger.parameters['longitude'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'longitude',     
             }

              #swagger.parameters['latitude'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'latitude',     
             }

               #swagger.parameters['address'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'address',     
             }

              #swagger.parameters['vehicleImg'] = {
                 in: 'formData',
                 type: 'file',
                 description: 'vehicleImg',
             }  


              #swagger.parameters['vehicleRegistrationImg'] = {
                 in: 'formData',
                 type: 'file',
                 description: 'vehicleRegistrationImg',
             }  


              #swagger.parameters['insuranceImg'] = {
                 in: 'formData',
                 type: 'file',
                 description: 'insuranceImg',
             }  

              
            */

    if (expression) {
      // #swagger.responses[201] = { description: 'User Updated successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.post("/auth/logout", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['USER-AUTHENTICATION']
                        #swagger.description = 'Endpoint to user logout.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'User Logout successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/auth/deleteAccount", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['USER-AUTHENTICATION']
        #swagger.description = 'Endpoint to user Delete Account.' 
    */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'User Logout successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });

  /*START SUBSCRIPTION_PLAN ROUTE*/
  app.post("/admin/subscription-plan/add", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['SUBSCRIPTION_PLAN']
             #swagger.description = 'Endpoint to add stripe.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /*  #swagger.parameters['obj'] = {
                            in: 'body',
                            description: 'Some description...',
                            schema: {
                                   $name: "",
                                   $planType: 1,
                                   $currency: "",
                                   $amount: 0,
                                   $features: ""
                                  }                                  
                    } */

    if (expression) {
      // #swagger.responses[201] = { description: 'stripe added successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/subscription-plan/list", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['SUBSCRIPTION_PLAN']
                           #swagger.description = 'Endpoint to get stripe list.' 
                    */
    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['pageNo'] = {
                         in: 'query',
                         description: 'Enter pageNo.'
                        }
                   */

    /* #swagger.parameters['pageLimit'] = {
                         in: 'query',
                         description: 'Enter pageLimit.'
                        }
                   */

    if (expression) {
      // #swagger.responses[201] = { description: 'stripe list found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/subscription-plan/detail/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['SUBSCRIPTION_PLAN']
                          #swagger.description = 'Endpoint to delete stripe.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'stripe delete successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/admin/subscription-plan/updateState/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['SUBSCRIPTION_PLAN']
                                 #swagger.description = 'Endpoint to change stripe state.' 
                          */

    /* #swagger.security = [{ "Bearer": [] }] */
    /* #swagger. /*START CMS ROUTE*/ parameters["stateId"] = {
      in: "query",
      description: "Enter stateId.",
    };

    if (expression) {
      // #swagger.responses[201] = { description: 'stripe updated successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/admin/subscription-plan/update/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['SUBSCRIPTION_PLAN']
        #swagger.description = 'Endpoint to update TWILIO.' 
                                */

    /* #swagger.security = [{ "Bearer": [] }] */

    /*  #swagger.parameters['obj'] = {
                             in: 'body',
                             description: 'Some description...',
                             schema: {
                                    $name: "",
                                    $planType: 1,
                                    $currency: "",
                                    $amount: 0,
                                    $features: ""
                                   }                                  
                     } */
    if (expression) {
      // #swagger.responses[201] = { description: 'Data updated successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.delete("/admin/subscription-plan/delete/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['SUBSCRIPTION_PLAN']
                          #swagger.description = 'Endpoint to delete stripe.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'stripe delete successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });

  /*START CMS ROUTE*/
  app.post("/admin/cms/add", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['CMS']
                                    #swagger.description = 'Endpoint to add cms.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /*
          #swagger.consumes = ['multipart/form-data']  
             #swagger.parameters['image'] = {
                 in: 'formData',
                 type: 'file',
                 description: 'image',
             } 
  
=             #swagger.parameters['title'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter title',
             } 
    
              #swagger.parameters['description'] = {
                  in: 'formData',
                  type: 'string',
                  description: 'description', 
              }
                 
              #swagger.parameters['typeId'] = {
                 in: 'formData',
                 type: 'number',
                 description: 'typeId',     
              }

            */

    if (expression) {
      // #swagger.responses[201] = { description: 'CMS added successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/cms/list", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['CMS']
                        #swagger.description = 'Endpoint to get csm list.' 
                              */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['pageNo'] = {
                               in: 'query',
                               description: 'Enter pageNo.'
                              }
                         */

    /* #swagger.parameters['pageLimit'] = {
                               in: 'query',
                               description: 'Enter pageLimit.'
                              }
                         */

    if (expression) {
      // #swagger.responses[201] = { description: 'CMS found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/cms/detail/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['CMS']
                                     #swagger.description = 'Endpoint to get single cms.' 
                              */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'CMS found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/admin/cms/update/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['CMS']
                                     #swagger.description = 'Endpoint to update single cms.' 
                              */

    /* #swagger.security = [{ "Bearer": [] }] */

    /*
          #swagger.consumes = ['multipart/form-data']  
             #swagger.parameters['image'] = {
                 in: 'formData',
                 type: 'file',
                 description: 'image',
             } 
  
=             #swagger.parameters['title'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter title',
             } 
    
             #swagger.parameters['description'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'description',
                 
             }
    
            #swagger.parameters['typeId'] = {
                 in: 'formData',
                 type: 'number',
                 description: 'typeId',     
             }

            */

    if (expression) {
      // #swagger.responses[201] = { description: 'CMS updated successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/admin/cms/updateState/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['CMS']
                                 #swagger.description = 'Endpoint to change faq state.' 
                          */

    /* #swagger.security = [{ "Bearer": [] }] */
    /* #swagger.parameters['stateId'] = {
                           in: 'query',
                           description: 'Enter stateId.'
                          }
                     */

    if (expression) {
      // #swagger.responses[201] = { description: 'FAQ updated successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.delete("/admin/cms/delete/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['CMS']
                                 #swagger.description = 'Endpoint to get delete cms.' 
                          */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'FAQ deleted successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });

  /*START FAQs ROUTE*/
  app.post("/admin/faq/add", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['FAQ']
                                #swagger.description = 'Endpoint to add faq.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /*  #swagger.parameters['obj'] = {
                             in: 'body',
                             title: 'Some description...',
                             schema: {
                                    $question: "",
                                    $answer: "",
                                 }
                     } */

    if (expression) {
      // #swagger.responses[201] = { description: 'FAQ added successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/faq/list", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['FAQ']
                                 #swagger.description = 'Endpoint to get faq list.' 
                          */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['pageNo'] = {
                           in: 'query',
                           description: 'Enter pageNo.'
                          }
                     */

    /* #swagger.parameters['pageLimit'] = {
                           in: 'query',
                           description: 'Enter pageLimit.'
                          }
                     */

    if (expression) {
      // #swagger.responses[201] = { description: 'FAQ added successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/faq/detail/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['FAQ']
                                 #swagger.description = 'Endpoint to get single faq.' 
                          */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'FAQ found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/admin/faq/edit/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['FAQ']
                                 #swagger.description = 'Endpoint to update single faq.' 
                          */

    /* #swagger.security = [{ "Bearer": [] }] */

    /*  #swagger.parameters['obj'] = {
                             in: 'body',
                             title: 'Some description...',
                             schema: {
                                    $question: "",
                                    $answer: "",
                                    $stateId:"",
                                 }
                     } */

    if (expression) {
      // #swagger.responses[201] = { description: 'FAQ updated successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/admin/faq/updateState/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['FAQ']
                                 #swagger.description = 'Endpoint to change faq state.' 
                          */

    /* #swagger.security = [{ "Bearer": [] }] */
    /* #swagger.parameters['stateId'] = {
                           in: 'query',
                           description: 'Enter stateId.'
                          }
                     */

    if (expression) {
      // #swagger.responses[201] = { description: 'FAQ updated successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.delete("/admin/faq/delete/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['FAQ']
                                 #swagger.description = 'Endpoint to delete faq.' 
                          */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'FAQ deleted successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });

    /*START ORDER MANAGEMENT*/
    app.post("/admin/order/add", (req, res) => {
      res.setHeader("Content-Type", "application/xml");
      /*  #swagger.tags = ['ORDER']
                                  #swagger.description = 'Endpoint to add faq.' */
  
      /* #swagger.security = [{ "Bearer": [] }] */
  
      /*  #swagger.parameters['obj'] = {
                               in: 'body',
                               title: 'Some description...',
                               schema: {
                                      $question: "",
                                      $answer: "",
                                   }
                       } */
  
      if (expression) {
        // #swagger.responses[201] = { description: 'FAQ added successfully.' }
        return res.status(201).send(data);
      }
      return res.status(500);
    });
    app.get("/admin/order/list", (req, res) => {
      res.setHeader("Content-Type", "application/xml");
  
      /*  #swagger.tags = ['ORDER']
                                   #swagger.description = 'Endpoint to get faq list.' 
                            */
  
      /* #swagger.security = [{ "Bearer": [] }] */
  
      /* #swagger.parameters['pageNo'] = {
                             in: 'query',
                             description: 'Enter pageNo.'
                            }
                       */
  
      /* #swagger.parameters['pageLimit'] = {
                             in: 'query',
                             description: 'Enter pageLimit.'
                            }
                       */
  
      if (expression) {
        // #swagger.responses[201] = { description: 'FAQ added successfully.' }
        return res.status(201).send(data);
      }
      return res.status(500);
    });
    app.get("/admin/order/detail/:id", (req, res) => {
      res.setHeader("Content-Type", "application/xml");
  
      /*  #swagger.tags = ['ORDER']
                                   #swagger.description = 'Endpoint to get single faq.' 
                            */
  
      /* #swagger.security = [{ "Bearer": [] }] */
  
      if (expression) {
        // #swagger.responses[201] = { description: 'FAQ found successfully.' }
        return res.status(201).send(data);
      }
      return res.status(500);
    });
    app.put("/admin/order/edit/:id", (req, res) => {
      res.setHeader("Content-Type", "application/xml");
  
      /*  #swagger.tags = ['ORDER']
                                   #swagger.description = 'Endpoint to update single faq.' 
                            */
  
      /* #swagger.security = [{ "Bearer": [] }] */
  
      /*  #swagger.parameters['obj'] = {
                               in: 'body',
                               title: 'Some description...',
                               schema: {
                                      $question: "",
                                      $answer: "",
                                      $stateId:"",
                                   }
                       } */
  
      if (expression) {
        // #swagger.responses[201] = { description: 'FAQ updated successfully.' }
        return res.status(201).send(data);
      }
      return res.status(500);
    });
    app.put("/admin/order/updateState/:id", (req, res) => {
      res.setHeader("Content-Type", "application/xml");
  
      /*  #swagger.tags = ['ORDER']
                                   #swagger.description = 'Endpoint to change faq state.' 
                            */
  
      /* #swagger.security = [{ "Bearer": [] }] */
      /* #swagger.parameters['stateId'] = {
                             in: 'query',
                             description: 'Enter stateId.'
                            }
                       */
  
      if (expression) {
        // #swagger.responses[201] = { description: 'FAQ updated successfully.' }
        return res.status(201).send(data);
      }
      return res.status(500);
    });
    app.delete("/admin/order/delete/:id", (req, res) => {
      res.setHeader("Content-Type", "application/xml");
  
      /*  #swagger.tags = ['ORDER']
                                   #swagger.description = 'Endpoint to delete faq.' 
                            */
  
      /* #swagger.security = [{ "Bearer": [] }] */
  
      if (expression) {
        // #swagger.responses[201] = { description: 'FAQ deleted successfully.' }
        return res.status(201).send(data);
      }
      return res.status(500);
    });



    /*START Search ROUTE*/
    app.post("/users/search/add", (req, res) => {
      res.setHeader("Content-Type", "application/xml");
      /*  #swagger.tags = ['SEARCH']
                                  #swagger.description = 'Endpoint to add faq.' */
  
      /* #swagger.security = [{ "Bearer": [] }] */
  
      /*  #swagger.parameters['obj'] = {
                               in: 'body',
                               title: 'Some description...',
                               schema: {
                                      $search: ""
                                   }
                       } */
  
      if (expression) {
        // #swagger.responses[201] = { description: 'FAQ added successfully.' }
        return res.status(201).send(data);
      }
      return res.status(500);
    });
    app.get("/users/search/list", (req, res) => {
      res.setHeader("Content-Type", "application/xml");
  
      /*  #swagger.tags = ['SEARCH']
                                   #swagger.description = 'Endpoint to get faq list.' 
                            */
  
      /* #swagger.security = [{ "Bearer": [] }] */
  
      /* #swagger.parameters['pageNo'] = {
                             in: 'query',
                             description: 'Enter pageNo.'
                            }
                       */
  
      /* #swagger.parameters['pageLimit'] = {
                             in: 'query',
                             description: 'Enter pageLimit.'
                            }
                       */
  
      if (expression) {
        // #swagger.responses[201] = { description: 'FAQ added successfully.' }
        return res.status(201).send(data);
      }
      return res.status(500);
    });
    app.get("/users/search/detail/:id", (req, res) => {
      res.setHeader("Content-Type", "application/xml");
  
      /*  #swagger.tags = ['SEARCH']
                                   #swagger.description = 'Endpoint to get single faq.' 
                            */
  
      /* #swagger.security = [{ "Bearer": [] }] */
  
      if (expression) {
        // #swagger.responses[201] = { description: 'FAQ found successfully.' }
        return res.status(201).send(data);
      }
      return res.status(500);
    });
    app.delete("/users/search/delete/:id", (req, res) => {
      res.setHeader("Content-Type", "application/xml");
  
      /*  #swagger.tags = ['SEARCH']
                                   #swagger.description = 'Endpoint to delete faq.' 
                            */
  
      /* #swagger.security = [{ "Bearer": [] }] */
  
      if (expression) {
        // #swagger.responses[201] = { description: 'FAQ deleted successfully.' }
        return res.status(201).send(data);
      }
      return res.status(500);
    });

  /*Add user Profile*/
  app.post("/admin/user/add", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['ADMIN']
                    #swagger.description = 'Endpoint to change faq state.' 
                          */

    /* #swagger.security = [{ "Bearer": [] }] */
    /*
          #swagger.consumes = ['multipart/form-data'] 
                #swagger.parameters['profileImg'] = {
                 in: 'formData',
                 type: 'file',
                 description: 'profileImg',


             #swagger.parameters['fullName'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter fullName',
             }

               #swagger.parameters['countryCode'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter countryCode',
             }

              #swagger.parameters['mobile'] = {
                 in: 'formData',
                 type: 'number',
                 description: 'Enter mobile',
             }

             #swagger.parameters['gender'] = {
                 in: 'formData',
                 type: 'number',
                 description: 'gender',     
             }
                  #swagger.parameters['dob'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'dob',     
             }

              #swagger.parameters['longitude'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'longitude',     
             }

              #swagger.parameters['latitude'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'latitude',     
             }

               #swagger.parameters['address'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'address',     
             }

              #swagger.parameters['vehicleImg'] = {
                 in: 'formData',
                 type: 'file',
                 description: 'vehicleImg',
             }  


              #swagger.parameters['vehicleRegistrationImg'] = {
                 in: 'formData',
                 type: 'file',
                 description: 'vehicleRegistrationImg',
             }  


              #swagger.parameters['insuranceImg'] = {
                 in: 'formData',
                 type: 'file',
                 description: 'insuranceImg',
             }  

              
            */

    if (expression) {
      // #swagger.responses[201] = { description: 'FAQ updated successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/admin/user/edit/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['ADMIN']
                            #swagger.description = 'Endpoint to edit user.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /*
          #swagger.consumes = ['multipart/form-data'] 
                #swagger.parameters['profileImg'] = {
                 in: 'formData',
                 type: 'file',
                 description: 'profileImg',


             #swagger.parameters['fullName'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter fullName',
             }

               #swagger.parameters['countryCode'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter countryCode',
             }

              #swagger.parameters['mobile'] = {
                 in: 'formData',
                 type: 'number',
                 description: 'Enter mobile',
             }

             #swagger.parameters['gender'] = {
                 in: 'formData',
                 type: 'number',
                 description: 'gender',     
             }
                  #swagger.parameters['dob'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'dob',     
             }

              #swagger.parameters['longitude'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'longitude',     
             }

              #swagger.parameters['latitude'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'latitude',     
             }

               #swagger.parameters['address'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'address',     
             }

              #swagger.parameters['vehicleImg'] = {
                 in: 'formData',
                 type: 'file',
                 description: 'vehicleImg',
             }  

              #swagger.parameters['vehicleRegistrationImg'] = {
                 in: 'formData',
                 type: 'file',
                 description: 'vehicleRegistrationImg',
             }  


              #swagger.parameters['insuranceImg'] = {
                 in: 'formData',
                 type: 'file',
                 description: 'insuranceImg',
             }  

              
            */
    if (expression) {
      // #swagger.responses[201] = { description: 'User Updated successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/user/list", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['ADMIN']
                            #swagger.description = 'Endpoint to get  user list' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['state'] = {
                         in: 'query',
                         description: 'Enter state.'
                        }
                   */

    /* #swagger.parameters['search'] = {
                         in: 'query',
                         description: 'Enter search.'
                        }
                   */

    /* #swagger.parameters['pageNo'] = {
                         in: 'query',
                         description: 'Enter pageNo.'
                        }
                   */

    /* #swagger.parameters['pageLimit'] = {
                         in: 'query',
                         description: 'Enter pageLimit.'
                        }
                   */

    if (expression) {
      // #swagger.responses[201] = { description: 'Users list found Successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/user/view/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['ADMIN']
                                     #swagger.description = 'Endpoint to get user detail.' 
                              */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'Data found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/admin/user/updateState/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['ADMIN']
                    #swagger.description = 'Endpoint to change faq state.' 
                          */

    /* #swagger.security = [{ "Bearer": [] }] */
    /*  #swagger.parameters['obj'] = {
                              in: 'body',
                              title: 'Some description...',
                              schema: {
                                     $stateId: "",
                                     
                                  }
                      } */

    if (expression) {
      // #swagger.responses[201] = { description: 'FAQ updated successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/admin/auth/user/verifyFrontImg/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['USER-AUTHENTICATION']
                #swagger.description = 'Endpoint to signup a user.'
     */

    if (expression) {
      // #swagger.responses[201] = { description: 'User SignIn Successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/admin/auth/user/verifyBackImg/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['USER-AUTHENTICATION']
                #swagger.description = 'Endpoint to signup a user.'
     */

    if (expression) {
      // #swagger.responses[201] = { description: 'User SignIn Successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/admin/auth/user/verifySelfImg/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['USER-AUTHENTICATION']
                #swagger.description = 'Endpoint to signup a user.'
     */

    if (expression) {
      // #swagger.responses[201] = { description: 'User SignIn Successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/admin/user/verify-user/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['ADMIN']
                    #swagger.description = 'Endpoint to change faq state.' 
                          */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'FAQ updated successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/admin/user/ban/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['ADMIN']
                    #swagger.description = 'Endpoint to change faq state.' 
                          */

    /* #swagger.security = [{ "Bearer": [] }] */
    /*  #swagger.parameters['obj'] = {
                             in: 'body',
                             title: 'Some description...',
                             schema: {
                                    $reason: "",
                                    
                                 }
                     } */

    if (expression) {
      // #swagger.responses[201] = { description: 'FAQ updated successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });

  /*START CRASH ROUTE*/
  app.post("/users/apiLogs/createCrash", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['CRASH']
                            #swagger.description = 'Endpoint to get Error logs' */

    /* #swagger.security = [{ "Bearer": [] }] */
    /*  #swagger.parameters['obj'] = {
                             in: 'body',
                             title: 'Some description...',
                             schema: {
                                    $errorCode: "",
                                    $error: "",
                                    $ip: "",
                                    $link: "",
                                    $errorName: "",
                                    $refererLink: "",
                                    $headers: "",
                                 }
                     } */

    if (expression) {
      // #swagger.responses[201] = { description: 'Data Found Successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/users/apiLogs/crashList", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['CRASH']
                            #swagger.description = 'Endpoint to get Error logs' */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'Data Found Successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });

  /*START DASHBOARD ROUTE*/
  app.get("/admin/dashboard/count", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['DASHBOARD']
                            #swagger.description = 'Endpoint to get provider dashboard count.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'Provider dashbaord Found Successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/dashboard/graphData/:year", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['DASHBOARD']
                            #swagger.description = 'Endpoint to delete Error logs' */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'Data Found Successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });

  /*Get Error-List*/
  app.get("/admin/logs/errorList", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['LOGS']
                            #swagger.description = 'Endpoint to get Error logs' */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'Data Found Successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/logs/errorView/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['LOGS']
                            #swagger.description = 'Endpoint to delete Error logs' */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'Data Found Successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.delete("/admin/logs/deleteAll", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['LOGS']
                            #swagger.description = 'Endpoint to delete Error logs' */
    /* #swagger.security = [{ "Bearer": [] }] */
    if (expression) {
      // #swagger.responses[201] = { description: 'Data Found Successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.delete("/admin/logs/delete/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['LOGS']
                      #swagger.description = 'Endpoint to delete email.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'Email delete successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });

  /*Routes for email*/
  app.get("/admin/emailLogs/list", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['EMAIL LOG']
                       #swagger.description = 'Endpoint to get email list.' 
                */
    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['state'] = {
                     in: 'query',
                     description: 'Enter state.'
                    }
               */

    /* #swagger.parameters['search'] = {
                     in: 'query',
                     description: 'Enter search.'
                    }
               */

    /* #swagger.parameters['pageNo'] = {
                     in: 'query',
                     description: 'Enter pageNo.'
                    }
               */

    /* #swagger.parameters['pageLimit'] = {
                     in: 'query',
                     description: 'Enter pageLimit.'
                    }
               */

    if (expression) {
      // #swagger.responses[201] = { description: 'email list found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/emailLogs/view/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['EMAIL LOG']
                      #swagger.description = 'Endpoint to view email details.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'email details found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.delete("/admin/emailLogs/delete/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['EMAIL LOG']
                      #swagger.description = 'Endpoint to delete email.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'Email delete successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.delete("/admin/emailLogs/deleteAll", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['EMAIL LOG']
                          #swagger.description = 'Endpoint to delete email.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'Emails delete successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });

  /*Routes for login history*/
  app.get("/admin/loginActivity/list", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['LOGIN_HISTORY']
                                   #swagger.description = 'Endpoint to get login history.' 
                            */
    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['pageNo'] = {
                                 in: 'query',
                                 description: 'Enter pageNo.'
                                }
                           */

    /* #swagger.parameters['pageLimit'] = {
                                 in: 'query',
                                 description: 'Enter pageLimit.'
                                }
                           */

    if (expression) {
      // #swagger.responses[201] = { description: 'login history found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/loginActivity/details/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['LOGIN_HISTORY']
                                  #swagger.description = 'Endpoint to view login activity details.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'login activity details found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.delete("/admin/loginActivity/deleteAll", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['LOGIN_HISTORY']
                                  #swagger.description = 'Endpoint to delete error log.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'error log  delete successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.delete("/admin/loginActivity/delete/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['LOGIN_HISTORY']
                      #swagger.description = 'Endpoint to delete email.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'Email delete successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });

  /*Routes static pages*/
  app.get("/pages/cms/:typeId", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['STATIC PAGES']
                        #swagger.description = 'Endpoint to get t&c,privacy pages.' */

    if (expression) {
      // #swagger.responses[201] = { description: 'Data Found Successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/pages/faq", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['STATIC PAGES']
                        #swagger.description = 'Endpoint to get faq list.' */
    if (expression) {
      // #swagger.responses[201] = { description: 'Data Found Successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });

  /*Routes for contactus*/
  app.post("/contactUs/add", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['CONTACTUS']
                            #swagger.description = 'Endpoint to add contactus.' */

    /*  #swagger.parameters['obj'] = {
                           in: 'body',
                           description: 'Some description...',
                           schema: {
                                  $fullName: "",
                                  $email: "",                                  
                                  $message: "",
                                  $phoneNumber:"",
                                  $countryCode:""
                           }
                   } */
    if (expression) {
      // #swagger.responses[201] = { description: 'contactus added successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/contactUs/list", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['CONTACTUS']
                           #swagger.description = 'Endpoint to get contactus list.' 
                    */
    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['state'] = {
                         in: 'query',
                         description: 'Enter state.'
                        }
                   */

    /* #swagger.parameters['search'] = {
                         in: 'query',
                         description: 'Enter state.'
                        }
                   */

    /* #swagger.parameters['pageNo'] = {
                         in: 'query',
                         description: 'Enter pageNo.'
                        }
                   */

    /* #swagger.parameters['pageLimit'] = {
                         in: 'query',
                         description: 'Enter pageLimit.'
                        }
                   */

    if (expression) {
      // #swagger.responses[201] = { description: 'contactus list found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/contactus/view/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['CONTACTUS']
                          #swagger.description = 'Endpoint to view contactus details.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'contactus details found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.delete("/admin/contactus/delete/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['CONTACTUS']
                          #swagger.description = 'Endpoint to delete conatcus.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'conatcus delete successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/admin/contactUs/reply/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['CONTACTUS']
                            #swagger.description = 'Endpoint To change-state for Contact-us Detail' */
    /* #swagger.security = [{ "Bearer": [] }] */
    /*  #swagger.parameters['obj'] = {
                        in: 'body',
                        description: 'Some description...',
                        schema: {
                            $reply: "Not Good",
                        }
                } */

    if (expression) {
      // #swagger.responses[201] = { description: 'Updated Successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });

  /*Routes for admincontactus*/
  app.get("/user/contactUs/list", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['ADMIN_CONTACTUS']
                           #swagger.description = 'Endpoint to get contactus list.' 
                    */

    /* #swagger.parameters['search'] = {
                        in: 'query',
                        description: 'Enter state.'
                       }
                  */

    if (expression) {
      // #swagger.responses[201] = { description: 'contactus list found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });
  app.post("/admin/adminContactUs/add", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['ADMIN_CONTACTUS']
                            #swagger.description = 'Endpoint to add contactus.' */
    /* #swagger.security = [{ "Bearer": [] }] */

    /*  #swagger.parameters['obj'] = {
                           in: 'body',
                           description: 'Some description...',
                           schema: {
                                  $email: "",                                  
                                  $address: "",
                                  $facebookLink:"",
                                  $instaLink:"",
                                  $twitterLink:"",
                                  $linkedinLink:"",
                                  $mobile:"",
                                  $countryCode:""
                                  
                           }
                   } */
    if (expression) {
      // #swagger.responses[201] = { description: 'contactus added successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/admin/adminContactUs/update/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['ADMIN_CONTACTUS']
                            #swagger.description = 'Endpoint to add contactus.' */
    /* #swagger.security = [{ "Bearer": [] }] */

    /*  #swagger.parameters['obj'] = {
                           in: 'body',
                           description: 'Some description...',
                           schema: {
                                  $email: "",                                  
                                  $address: "",
                                  $facebookLink:"",
                                  $instaLink:"",
                                  $twitterLink:"",
                                  $linkedinLink:"",
                                  $mobile:"",
                                  $countryCode:""
                                  
                           }
                   } */
    if (expression) {
      // #swagger.responses[201] = { description: 'contactus added successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/adminContactUs/list", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['ADMIN_CONTACTUS']
                           #swagger.description = 'Endpoint to get contactus list.' 
                    */
    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['search'] = {
                        in: 'query',
                        description: 'Enter state.'
                       }
                  */

    if (expression) {
      // #swagger.responses[201] = { description: 'contactus list found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });
  app.delete("/admin/adminContactUs/delete/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['ADMIN_CONTACTUS']
                          #swagger.description = 'Endpoint to delete conatcus.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'conatcus delete successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });

  /*Routes for smtp*/
  app.post("/admin/smtp/add", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['SMTP']
             #swagger.description = 'Endpoint to add contactus.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /*  #swagger.parameters['obj'] = {
                           in: 'body',
                           description: 'Some description...',
                           schema: {
                                  $email: "",
                                  $password: "",                                  
                                  $host: "",
                                  $port:"",                          }
                   } */

    if (expression) {
      // #swagger.responses[201] = { description: 'contactus added successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/smtp/list", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['SMTP']
                           #swagger.description = 'Endpoint to get contactus list.' 
                    */
    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['pageNo'] = {
                         in: 'query',
                         description: 'Enter pageNo.'
                        }
                   */

    /* #swagger.parameters['pageLimit'] = {
                         in: 'query',
                         description: 'Enter pageLimit.'
                        }
                   */

    if (expression) {
      // #swagger.responses[201] = { description: 'contactus list found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });
  app.delete("/admin/smtp/delete/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['SMTP']
                          #swagger.description = 'Endpoint to delete conatcus.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'conatcus delete successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/smtp/view/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['SMTP']
                          #swagger.description = 'Endpoint to delete conatcus.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'conatcus delete successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/admin/smtp/updateState/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['SMTP']
                                 #swagger.description = 'Endpoint to change faq state.' 
                          */

    /* #swagger.security = [{ "Bearer": [] }] */
    /* #swagger.parameters['stateId'] = {
                           in: 'query',
                           description: 'Enter stateId.'
                          }
                     */

    if (expression) {
      // #swagger.responses[201] = { description: 'FAQ updated successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/admin/smtp/update/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['SMTP']
        #swagger.description = 'Endpoint to update SMTP.' 
                                */

    /* #swagger.security = [{ "Bearer": [] }] */

    /*  #swagger.parameters['obj'] = {
                          in: 'body',
                          description: 'Some description...',
                          schema: {
                                 $email: "",
                                 $password: "",                                  
                                 $host: "",
                                 $port:"",                          }
                  } */

    if (expression) {
      // #swagger.responses[201] = { description: 'Data updated successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });

  /*Routes for twilio*/
  app.post("/admin/twillio/add", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['TWILLIO']
             #swagger.description = 'Endpoint to add twilio.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /*  #swagger.parameters['obj'] = {
                            in: 'body',
                            description: 'Some description...',
                            schema: {
                                   $sid: "",
                                   $token: "",                                  
                                   $number: "",
                                  }
                    } */

    if (expression) {
      // #swagger.responses[201] = { description: 'twilio added successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/twillio/list", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['TWILLIO']
                           #swagger.description = 'Endpoint to get twilio list.' 
                    */
    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['pageNo'] = {
                         in: 'query',
                         description: 'Enter pageNo.'
                        }
                   */

    /* #swagger.parameters['pageLimit'] = {
                         in: 'query',
                         description: 'Enter pageLimit.'
                        }
                   */

    if (expression) {
      // #swagger.responses[201] = { description: 'twilio list found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });
  app.delete("/admin/twillio/delete/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['TWILLIO']
                          #swagger.description = 'Endpoint to delete twilio.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'twilio delete successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/twillio/view/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['TWILLIO']
                          #swagger.description = 'Endpoint to delete twilio.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'twilio delete successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/admin/twillio/updateState/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['TWILLIO']
                                 #swagger.description = 'Endpoint to change twilio state.' 
                          */

    /* #swagger.security = [{ "Bearer": [] }] */
    /* #swagger.parameters['stateId'] = {
                           in: 'query',
                           description: 'Enter stateId.'
                          }
                     */

    if (expression) {
      // #swagger.responses[201] = { description: 'twilio updated successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/admin/twillio/update/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['TWILLIO']
        #swagger.description = 'Endpoint to update TWILIO.' 
                                */

    /* #swagger.security = [{ "Bearer": [] }] */

    /*  #swagger.parameters['obj'] = {
                          in: 'body',
                          description: 'Some description...',
                          schema: {
                                 $sid: "",
                                 $token: "",                                  
                                 $number: "",
                                }
                  } */

    if (expression) {
      // #swagger.responses[201] = { description: 'Data updated successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });

  /*** REPORTS  ROUTE ***/
  app.get("/admin/user/graphUserReport/:year", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['REPORTS']
                            #swagger.description = 'Endpoint to delete Error logs' */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'Data Found Successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/subscription/graphSubscriptionReport/:year", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['REPORTS']
                            #swagger.description = 'Endpoint to delete Error logs' */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'Data Found Successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });

  /*START text-banner ROUTE*/
  app.post("/admin/banner/add", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['Banner']
                                    #swagger.description = 'Endpoint to add cms.' */

    /* #swagger.security = [{ "Bearer": [] }] */
    /*
          #swagger.consumes = ['multipart/form-data']  
             #swagger.parameters['bannerImg'] = {
                 in: 'formData',
                 type: 'file',
                 description: 'image',
             }
      */

    if (expression) {
      // #swagger.responses[201] = { description: 'CMS added successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/banner/list", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['Banner']
                        #swagger.description = 'Endpoint to get csm list.' 
                              */

    /* #swagger.security = [{ "Bearer": [] }] */
    /* #swagger.parameters['pageNo'] = {
                        in: 'query',
                        description: 'Enter pageNo.'
                       }
                  */

    /* #swagger.parameters['pageLimit'] = {
                         in: 'query',
                         description: 'Enter pageLimit.'
                        }
                   */

    if (expression) {
      // #swagger.responses[201] = { description: 'CMS found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/banner/detail/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['Banner']
                                     #swagger.description = 'Endpoint to get single cms.' 
                              */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'CMS found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/admin/banner/update/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['Banner']
                                     #swagger.description = 'Endpoint to update single cms.' 
                              */

    /* #swagger.security = [{ "Bearer": [] }] */
    /*
           #swagger.consumes = ['multipart/form-data']  
              #swagger.parameters['bannerImg'] = {
                  in: 'formData',
                  type: 'file',
                  description: 'image',
              } 
             */

    if (expression) {
      // #swagger.responses[201] = { description: 'CMS updated successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/admin/banner/updateState/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['Banner']
                                 #swagger.description = 'Endpoint to change faq state.' 
                          */

    /* #swagger.security = [{ "Bearer": [] }] */
    /* #swagger.parameters['stateId'] = {
                          in: 'query',
                          description: 'Enter stateId.'
                         }
                    */

    if (expression) {
      // #swagger.responses[201] = { description: 'FAQ updated successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.delete("/admin/banner/delete/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['Banner']
                                 #swagger.description = 'Endpoint to get delete cms.' 
                          */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'FAQ deleted successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/banner/activeBanners", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['Banner']
               #swagger.description = 'Endpoint to get csm list.' 
    */

    if (expression) {
      // #swagger.responses[201] = { description: 'CMS found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });

  /*START NOTIFICATION ROUTE */
  app.get("/admin/notification", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['NOTIFICATION']
                   #swagger.description = 'Endpoint to get notifications.' 
            */

    /* #swagger.security = [{ "Bearer": [] }] */
    /* #swagger.parameters['pageNo'] = {
             in: 'query',
             description: 'Enter pageNo.'
            }
       */

    /* #swagger.parameters['pageLimit'] = {
             in: 'query',
             description: 'Enter pageLimit.'
            }
       */

    if (expression) {
      // #swagger.responses[201] = { description: 'Notifications found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/notification/view/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['NOTIFICATION']
                   #swagger.description = 'Endpoint to get notifications.' 
            */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'Notifications found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/notification/count", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['NOTIFICATION']
                   #swagger.description = 'Endpoint to get notifications.' 
            */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'Notifications found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.delete("/admin/deleteAll", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['NOTIFICATION']
                   #swagger.description = 'Endpoint to get notifications.' 
            */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'Notifications found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/notification/count", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['NOTIFICATION']
                   #swagger.description = 'Endpoint to get notifications.' 
            */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'Notifications found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/notification", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['NOTIFICATION']
                   #swagger.description = 'Endpoint to get notifications.' 
            */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['pageNo'] = {
             in: 'query',
             description: 'Enter pageNo.'
            }
          } 
    */

    /* #swagger.parameters['pageLimit'] = {
             in: 'query',
             description: 'Enter pageLimit.'
            }
          } 
    */
    if (expression) {
      // #swagger.responses[201] = { description: 'Data added successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/notification/view/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['NOTIFICATION']
                   #swagger.description = 'Endpoint to get notifications.' 
            */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'Notifications found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/notification/count", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['NOTIFICATION']
                   #swagger.description = 'Endpoint to get notifications.' 
            */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'Notifications found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.delete("/notification/deleteAll", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['NOTIFICATION']
                            #swagger.description = 'Endpoint to delete Error logs' */
    /* #swagger.security = [{ "Bearer": [] }] */
    if (expression) {
      // #swagger.responses[201] = { description: 'Data Found Successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/notification/toggle", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['NOTIFICATION']
                   #swagger.description = 'Endpoint to toggle notifications.' 
            */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'Notifications found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });

  /*Routes for dateCheck*/
  app.post("/admin/dateCheck/add", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['DATE_CHECK']
               #swagger.description = 'Endpoint to add contactus.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /*  #swagger.parameters['obj'] = {
                           in: 'body',
                           description: 'Add report',
                           schema: {
                                  $date:"2025-06-30"
                             }
                   } */

    if (expression) {
      // #swagger.responses[201] = { description: 'contactus added successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/dateCheck/list", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['DATE_CHECK']
                        #swagger.description = 'Endpoint to get login history.' 
                              */
    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'login history found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/dateCheck/view/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['DATE_CHECK']
                 #swagger.description = 'Endpoint to view contactus details.'
    */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['id'] = {
          in: 'path',
          required: true,
          description: 'Enter id.',
          type: 'string',
          example: "66e7cf0759160948ff3f1b90"  
    } */

    if (expression) {
      // #swagger.responses[201] = { description: 'contactus details found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.delete("/admin/dateCheck/delete/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['DATE_CHECK']
                #swagger.description = 'Endpoint to delete backup.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['id'] = {
          in: 'path',
          required: true,
          description: 'Enter id.',
          type: 'string',
          example: "66e7cf0759160948ff3f1b90"  
    } */

    if (expression) {
      // #swagger.responses[201] = { description: 'Backup deleted successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/dateCheck/list", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['DATE_CHECK']
                        #swagger.description = 'Endpoint to get login history.' 
                              */
    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'login history found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });

  /*START CATEGORY ROUTE*/
  app.post("/admin/category/add", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['CATEGORY']
                                    #swagger.description = 'Endpoint to add cms.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /*
          #swagger.consumes = ['multipart/form-data']  
             #swagger.parameters['image'] = {
                 in: 'formData',
                 type: 'file',
                 description: 'image',
             } 
  
=             #swagger.parameters['title'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter title',
             } 
    
              #swagger.parameters['description'] = {
                  in: 'formData',
                  type: 'string',
                  description: 'description', 
              }
                 
            */

    if (expression) {
      // #swagger.responses[201] = { description: 'CMS added successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/category/list", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['CATEGORY']
                        #swagger.description = 'Endpoint to get csm list.' 
                              */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['pageNo'] = {
                               in: 'query',
                               description: 'Enter pageNo.'
                              }
                         */

    /* #swagger.parameters['pageLimit'] = {
                               in: 'query',
                               description: 'Enter pageLimit.'
                              }
                         */

    if (expression) {
      // #swagger.responses[201] = { description: 'CMS found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/category/detail/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['CATEGORY']
                                     #swagger.description = 'Endpoint to get single cms.' 
                              */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'CMS found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/admin/category/update/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['CATEGORY']
                                     #swagger.description = 'Endpoint to update single cms.' 
                              */

    /* #swagger.security = [{ "Bearer": [] }] */

    /*
          #swagger.consumes = ['multipart/form-data']  
             #swagger.parameters['image'] = {
                 in: 'formData',
                 type: 'file',
                 description: 'image',
             } 
  
=             #swagger.parameters['title'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter title',
             } 
    
             #swagger.parameters['description'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'description',
                 
             }

            */

    if (expression) {
      // #swagger.responses[201] = { description: 'CMS updated successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/admin/category/updateState/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['CATEGORY']
                                 #swagger.description = 'Endpoint to change faq state.' 
                          */

    /* #swagger.security = [{ "Bearer": [] }] */
    /* #swagger.parameters['stateId'] = {
                           in: 'query',
                           description: 'Enter stateId.'
                          }
                     */

    if (expression) {
      // #swagger.responses[201] = { description: 'FAQ updated successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.delete("/admin/category/delete/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['CATEGORY']
                                 #swagger.description = 'Endpoint to get delete cms.' 
                          */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'FAQ deleted successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/category/activeList", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['CATEGORY']
                        #swagger.description = 'Endpoint to get csm list.' 
    */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['search'] = {
                               in: 'query',
                               description: 'Enter search.'
                              }
                         */

    if (expression) {
      // #swagger.responses[201] = { description: 'CMS found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });

  /*START BRAND ROUTE*/
  app.post("/admin/brand/add", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['BRAND_MANAGEMENT']
                                    #swagger.description = 'Endpoint to add cms.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /*
          #swagger.consumes = ['multipart/form-data']  
             #swagger.parameters['image'] = {
                 in: 'formData',
                 type: 'file',
                 description: 'image',
             } 
  
=             #swagger.parameters['title'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter title',
             } 
                 
            */

    if (expression) {
      // #swagger.responses[201] = { description: 'CMS added successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/brand/list", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['BRAND_MANAGEMENT']
                        #swagger.description = 'Endpoint to get csm list.' 
                              */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['search'] = {
                               in: 'query',
                               description: 'Enter search.'
                              }
                         */

    /* #swagger.parameters['pageNo'] = {
                               in: 'query',
                               description: 'Enter pageNo.'
                              }
                         */

    /* #swagger.parameters['pageLimit'] = {
                               in: 'query',
                               description: 'Enter pageLimit.'
                              }
                         */

    if (expression) {
      // #swagger.responses[201] = { description: 'CMS found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/brand/detail/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['BRAND_MANAGEMENT']
                   #swagger.description = 'Endpoint to get single cms.' 
    */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'CMS found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/admin/brand/update/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['BRAND_MANAGEMENT']
                                     #swagger.description = 'Endpoint to update single cms.' 
                              */

    /* #swagger.security = [{ "Bearer": [] }] */

    /*
          #swagger.consumes = ['multipart/form-data']  
             #swagger.parameters['image'] = {
                 in: 'formData',
                 type: 'file',
                 description: 'image',
             } 
  
=             #swagger.parameters['title'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter title',
             } 

            */

    if (expression) {
      // #swagger.responses[201] = { description: 'CMS updated successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/admin/brand/updateState/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['BRAND_MANAGEMENT']
                   #swagger.description = 'Endpoint to change faq state.' 
    */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['stateId'] = {
                           in: 'query',
                           description: 'Enter stateId.'
                          }
                     */

    if (expression) {
      // #swagger.responses[201] = { description: 'FAQ updated successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.delete("/admin/brand/delete/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['BRAND_MANAGEMENT']
               #swagger.description = 'Endpoint to get delete cms.' 
    */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'FAQ deleted successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/brand/activeList", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['BRAND_MANAGEMENT']
                        #swagger.description = 'Endpoint to get csm list.' 
    */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['search'] = {
                               in: 'query',
                               description: 'Enter search.'
                              }
                         */

    if (expression) {
      // #swagger.responses[201] = { description: 'CMS found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });

  app.post("/admin/promotion/add", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['PROMOTION_CODE']
                      #swagger.description = 'Endpoint to order.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /*  #swagger.parameters['obj'] = {
                     in: 'body',
                     title: 'Some description...',
                     schema: {
                            $promoCode: "",
                            $discount: "",
                            $minPurchaseAmount: "",
                            $maxDiscountAmount: "",
                            $numberOfUsed: "",
                            $numberOfUsedUser: "",
                            $forFreeDelivery: "",
                            $startDate:"",
                            $endDate:""                 
                         }
             } */

    if (expression) {
      // #swagger.responses[201] = { description: 'order added successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/promotion/list", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['PROMOTION_CODE']
                    #swagger.description = 'Endpoint to get address list.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['pageNo'] = {
           in: 'query',
           description: 'Enter pageNo.'
          }
     */

    /* #swagger.parameters['pageLimit'] = {
           in: 'query',
           description: 'Enter pageLimit.'
          }
     */

    /* #swagger.parameters['search'] = {
           in: 'query',
           description: 'Enter search.'
          }
     */

    /* #swagger.parameters['stateId'] = {
           in: 'query',
           description: 'Enter stateId.'
          }
     */

    if (expression) {
      // #swagger.responses[201] = { description: 'address list found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/admin/promotion/update/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['PROMOTION_CODE']
                      #swagger.description = 'Endpoint to order.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /*  #swagger.parameters['obj'] = {
                     in: 'body',
                     title: 'Some description...',
                     schema: {
                            $promoCode: "",
                            $discount: "",
                            $minPurchaseAmount: "",
                            $maxDiscountAmount: "",
                            $numberOfUsed: "",
                            $numberOfUsedUser: "",
                            $forFreeDelivery: "",
                            $startDate:"",
                            $endDate:""                   
                         }
             } */

    if (expression) {
      // #swagger.responses[201] = { description: 'order added successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/admin/promotion/updateState/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['PROMOTION_CODE']
                      #swagger.description = 'Endpoint to change faq state.' 
                            */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['id'] = {
          in: 'path',
          required: true,
          description: 'Enter id.',
          type: 'string',
          example: "66e7cf0759160948ff3f1b90"  
    } */

    /* #swagger.parameters['stateId'] = {
                           in: 'query',
                           description: 'Enter stateId.',
                           type: 'number',
                           value:1
                          }
                     */

    if (expression) {
      // #swagger.responses[201] = { description: 'FAQ updated successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/promotion/detail/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['PROMOTION_CODE']
                #swagger.description = 'Endpoint to cancel order.' */
    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'order cancel successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.delete("/admin/promotion/delete/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['PROMOTION_CODE']
                    #swagger.description = 'Endpoint to delete address.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'address deleted successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/users/promotion/applyPromoCode", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['PROMOTION_CODE']
                    #swagger.description = 'Endpoint to get address list.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /*  #swagger.parameters['obj'] = {
                     in: 'body',
                     title: 'Some description...',
                     schema: {
                            $productId: "",
                            $promoId: "",               
                         }
             } */

    if (expression) {
      // #swagger.responses[201] = { description: 'address list found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });

  /*Routes for store*/
  app.post("/admin/store/add", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['STORE_MANAGEMENT']
                #swagger.description = 'Endpoint to add product.' */

    /* #swagger.security = [{ "Bearer": [] }] */
    /*
    
      #swagger.consumes = ['multipart/form-data']  

              #swagger.parameters['logo'] = {
                 in: 'formData',
                 type: 'file',
                 description: 'logo',
             }  

               #swagger.parameters['coverImg'] = {
                 in: 'formData',
                 type: 'file',
                 description: 'coverImg',
             }  
           
               #swagger.parameters['name'] = {
                in: 'formData',
                type: 'string',
                name:'name',
                description: 'Some description...',
             } 

              #swagger.parameters['description'] = {
                in: 'formData',
                type: 'string',
                name:'description',
                description: 'Some description...',
             } 
                
              #swagger.parameters['longitude'] = {
                in: 'formData',
                type: 'string',
                name:'longitude',
                description: 'Some description...',
            } 

             #swagger.parameters['latitude'] = {
                in: 'formData',
                type: 'string',
                name:'latitude',
                description: 'Some description...',
          } 

            #swagger.parameters['address'] = {
                in: 'formData',
                type: 'string',
                name:'address',
                description: 'Some description...',
          }
     */

    if (expression) {
      // #swagger.responses[201] = { description: 'product added successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.post("/admin/store/edit/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['STORE_MANAGEMENT']
                #swagger.description = 'Endpoint to add product.' */

    /* #swagger.security = [{ "Bearer": [] }] */
    /*
    
      #swagger.consumes = ['multipart/form-data']  

              #swagger.parameters['logo'] = {
                 in: 'formData',
                 type: 'file',
                 description: 'logo',
             }  

               #swagger.parameters['coverImg'] = {
                 in: 'formData',
                 type: 'file',
                 description: 'coverImg',
             }  
           
               #swagger.parameters['name'] = {
                in: 'formData',
                type: 'string',
                name:'name',
                description: 'Some description...',
             } 

              #swagger.parameters['description'] = {
                in: 'formData',
                type: 'string',
                name:'description',
                description: 'Some description...',
             } 
                
              #swagger.parameters['longitude'] = {
                in: 'formData',
                type: 'string',
                name:'longitude',
                description: 'Some description...',
            } 

             #swagger.parameters['latitude'] = {
                in: 'formData',
                type: 'string',
                name:'latitude',
                description: 'Some description...',
          } 

            #swagger.parameters['address'] = {
                in: 'formData',
                type: 'string',
                name:'address',
                description: 'Some description...',
          }
     */

    if (expression) {
      // #swagger.responses[201] = { description: 'product added successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/store/list", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['STORE_MANAGEMENT']
              #swagger.description = 'Endpoint to get all product list.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['search'] = {
           in: 'query',
           description: 'Enter search.'
          }
     */

    /* #swagger.parameters['stateId'] = {
           in: 'query',
           description: 'Enter stateId.'
          }
     */

    /* #swagger.parameters['pageNo'] = {
           in: 'query',
           description: 'Enter pageNo.'
          }
     */

    /* #swagger.parameters['pageLimit'] = {
           in: 'query',
           description: 'Enter pageLimit.'
          }
     */

    if (expression) {
      // #swagger.responses[201] = { description: 'product list found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/store/details/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['STORE_MANAGEMENT']
              #swagger.description = 'Endpoint to get product details.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'product details found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/admin/store/updateState/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['STORE_MANAGEMENT']
                            #swagger.description = 'Endpoint to add contactus.' */
    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['stateId'] = {
                         in: 'query',
                         description: 'Enter stateId.'
                        }
                   */

    if (expression) {
      // #swagger.responses[201] = { description: 'contactus added successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.delete("/admin/store/delete/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['STORE_MANAGEMENT']
              #swagger.description = 'Endpoint to get product details.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'product details found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/store/subAdminList", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['STORE_MANAGEMENT']
              #swagger.description = 'Endpoint to get all product list.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['search'] = {
           in: 'query',
           description: 'Enter search.'
          }
     */

    /* #swagger.parameters['pageNo'] = {
           in: 'query',
           description: 'Enter pageNo.'
          }
     */

    /* #swagger.parameters['pageLimit'] = {
           in: 'query',
           description: 'Enter pageLimit.'
          }
     */

    if (expression) {
      // #swagger.responses[201] = { description: 'product list found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/admin/store/assignStore/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['STORE_MANAGEMENT']
                            #swagger.description = 'Endpoint to add contactus.' */
    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['subAdmin'] = {
                         in: 'query',
                         description: 'Enter subAdmin.'
                        }
                   */

    if (expression) {
      // #swagger.responses[201] = { description: 'contactus added successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/admin/store/unAssign/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['STORE_MANAGEMENT']
                            #swagger.description = 'Endpoint to add contactus.' */
    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['subAdmin'] = {
                         in: 'query',
                         description: 'Enter subAdmin.'
                        }
                   */

    if (expression) {
      // #swagger.responses[201] = { description: 'contactus added successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/store/storeList", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['STORE_MANAGEMENT']
              #swagger.description = 'Endpoint to get all product list.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['search'] = {
           in: 'query',
           description: 'Enter search.'
          }
     */

    /* #swagger.parameters['pageNo'] = {
           in: 'query',
           description: 'Enter pageNo.'
          }
     */

    /* #swagger.parameters['pageLimit'] = {
           in: 'query',
           description: 'Enter pageLimit.'
          }
     */

    if (expression) {
      // #swagger.responses[201] = { description: 'product list found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });

  /*Routes for product*/
  app.post("/admin/product/add", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['PRODUCT_MANAGEMENT']
                #swagger.description = 'Endpoint to add product.' */

    /* #swagger.security = [{ "Bearer": [] }] */
    /*
    
      #swagger.consumes = ['multipart/form-data']  
       #swagger.parameters['productImg'] = {
        in: 'formData',
        type: 'array',
        name:'productImg',
        description: 'Add productImg...',
        collectionFormat: 'multi',
        items: { type: 'file' }
    }
           
               #swagger.parameters['productName'] = {
                in: 'formData',
                type: 'string',
                name:'productName',
                description: 'Some description...',
          } 

          #swagger.parameters['description'] = {
                in: 'formData',
                type: 'string',
                name:'description',
                description: 'Some description...',
          } 

           #swagger.parameters['ingredients'] = {
                in: 'formData',
                type: 'string',
                name:'ingredients',
                description: 'Some ingredients...',
          }   
            
           #swagger.parameters['mrp'] = {
                in: 'formData',
                type: 'number',
                name:'mrp',
                description: 'Some mrp...',
          } 

           #swagger.parameters['discount'] = {
                in: 'formData',
                type: 'number',
                name:'price',
                description: 'Some discount...',
          } 

            #swagger.parameters['size'] = {
                in: 'formData',
                type: 'string',
                name:'size',
                description: 'Some size...',
          } 

           #swagger.parameters['category'] = {
                in: 'formData',
                type: 'string',
                name:'category',
                description: 'Some category...',
          } 

           #swagger.parameters['brand'] = {
                in: 'formData',
                type: 'string',
                name:'brand',
                description: 'Some brand...',
          } 

              #swagger.parameters['longitude'] = {
                in: 'formData',
                type: 'string',
                name:'longitude',
                description: 'Some description...',
          } 

           #swagger.parameters['latitude'] = {
                in: 'formData',
                type: 'string',
                name:'latitude',
                description: 'Some description...',
          } 

            #swagger.parameters['address'] = {
                in: 'formData',
                type: 'string',
                name:'address',
                description: 'Some description...',
          }
     */

    if (expression) {
      // #swagger.responses[201] = { description: 'product added successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/admin/product/edit/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['PRODUCT_MANAGEMENT']
                #swagger.description = 'Endpoint to add product.' */

    /* #swagger.security = [{ "Bearer": [] }] */
    /*
     #swagger.consumes = ['multipart/form-data']  
       #swagger.parameters['productImg'] = {
        in: 'formData',
        type: 'array',
        name:'productImg',
        description: 'Add productImg...',
        collectionFormat: 'multi',
        items: { type: 'file' }
    }
           
               #swagger.parameters['productName'] = {
                in: 'formData',
                type: 'string',
                name:'productName',
                description: 'Some description...',
          } 

          #swagger.parameters['description'] = {
                in: 'formData',
                type: 'string',
                name:'description',
                description: 'Some description...',
          } 

                #swagger.parameters['ingredients'] = {
                in: 'formData',
                type: 'string',
                name:'ingredients',
                description: 'Some ingredients...',
          }   
            
            
           #swagger.parameters['mrp'] = {
                in: 'formData',
                type: 'number',
                name:'mrp',
                description: 'Some mrp...',
          } 

           #swagger.parameters['discount'] = {
                in: 'formData',
                type: 'number',
                name:'price',
                description: 'Some discount...',
          } 

               #swagger.parameters['size'] = {
                in: 'formData',
                type: 'string',
                name:'size',
                description: 'Some size...',
          }

          #swagger.parameters['category'] = {
                in: 'formData',
                type: 'string',
                name:'category',
                description: 'Some category...',
          } 

           #swagger.parameters['brand'] = {
                in: 'formData',
                type: 'string',
                name:'brand',
                description: 'Some brand...',
          } 

              #swagger.parameters['longitude'] = {
                in: 'formData',
                type: 'string',
                name:'longitude',
                description: 'Some description...',
          } 

           #swagger.parameters['latitude'] = {
                in: 'formData',
                type: 'string',
                name:'latitude',
                description: 'Some description...',
          } 

            #swagger.parameters['address'] = {
                in: 'formData',
                type: 'string',
                name:'address',
                description: 'Some description...',
          }

             #swagger.parameters['mobile'] = {
                in: 'formData',
                type: 'string',
                name:'mobile',
                description: 'Some description...',
          }
             #swagger.parameters['countryode'] = {
                in: 'formData',
                type: 'string',
                name:'address',
                description: 'Some description...',
          }
     */

    if (expression) {
      // #swagger.responses[201] = { description: 'product added successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.delete("/admin/product/removeImage", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['PRODUCT_MANAGEMENT']
                     #swagger.description = 'Endpoint to delete loan.' 
              */

    /* #swagger.security = [{ "Bearer": [] }] */
    /* #swagger.parameters['id'] = {
           in: 'query',
           description: 'Enter id.'
          }
     */

    /* #swagger.parameters['imageId'] = {
           in: 'query',
           description: 'Enter imageId.'
          }
     */

    if (expression) {
      // #swagger.responses[201] = { description: 'loan deleted successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/product/list", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['PRODUCT_MANAGEMENT']
              #swagger.description = 'Endpoint to get all product list.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['stateId'] = {
           in: 'query',
           description: 'Enter stateId.'
          }
     */

    /* #swagger.parameters['search'] = {
           in: 'query',
           description: 'Enter search.'
          }
     */

    /* #swagger.parameters['pageNo'] = {
           in: 'query',
           description: 'Enter pageNo.'
          }
     */

    /* #swagger.parameters['pageLimit'] = {
           in: 'query',
           description: 'Enter pageLimit.'
          }
     */

    if (expression) {
      // #swagger.responses[201] = { description: 'product list found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/product/details/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['PRODUCT_MANAGEMENT']
              #swagger.description = 'Endpoint to get product details.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'product details found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.delete("/admin/product/delete/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['PRODUCT_MANAGEMENT']
              #swagger.description = 'Endpoint to get product details.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'product details found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/admin/product/updateState/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['PRODUCT_MANAGEMENT']
                            #swagger.description = 'Endpoint to add contactus.' */
    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['stateId'] = {
                         in: 'query',
                         description: 'Enter stateId.'
                        }
                   */

    if (expression) {
      // #swagger.responses[201] = { description: 'contactus added successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/users/product/allProduct", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['PRODUCT_MANAGEMENT']
              #swagger.description = 'Endpoint to get all product list.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['search'] = {
           in: 'query',
           description: 'Enter search.'
          }
     */

    /* #swagger.parameters['pageNo'] = {
           in: 'query',
           description: 'Enter pageNo.'
          }
     */

    /* #swagger.parameters['pageLimit'] = {
           in: 'query',
           description: 'Enter pageLimit.'
          }
     */

    /* #swagger.parameters['categoryId'] = {
           in: 'query',
           description: 'Enter categoryId.'
          }
     */

    /* #swagger.parameters['brandId'] = {
           in: 'query',
           description: 'Enter brandId.'
          }
     */

    /* #swagger.parameters['minPrice'] = {
           in: 'query',
           description: 'Enter minPrice.'
          }
     */

    /* #swagger.parameters['maxPrice'] = {
           in: 'query',
           description: 'Enter maxPrice.'
          }
     */

    /* #swagger.parameters['minRating'] = {
           in: 'query',
           description: 'Enter minRating.'
          }
     */

    /* #swagger.parameters['maxRating'] = {
           in: 'query',
           description: 'Enter maxRating.'
          }
     */

    /* #swagger.parameters['longitude'] = {
           in: 'query',
           description: 'Enter longitude.'
          }
     */

    /* #swagger.parameters['latitude'] = {
           in: 'query',
           description: 'Enter latitude.'
          }
     */

    if (expression) {
      // #swagger.responses[201] = { description: 'product list found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/users/product/details/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['PRODUCT_MANAGEMENT']
              #swagger.description = 'Endpoint to get product details.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'product details found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/users/product/relatedProduct", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['PRODUCT_MANAGEMENT']
              #swagger.description = 'Endpoint to get all product list.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['search'] = {
           in: 'query',
           description: 'Enter search.'
          }
     */

    /* #swagger.parameters['pageNo'] = {
           in: 'query',
           description: 'Enter pageNo.'
          }
     */

    /* #swagger.parameters['pageLimit'] = {
           in: 'query',
           description: 'Enter pageLimit.'
          }
     */

    /* #swagger.parameters['categoryId'] = {
           in: 'query',
           description: 'Enter categoryId.'
          }
     */

    if (expression) {
      // #swagger.responses[201] = { description: 'product list found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });

  /*Routes for cart*/
  app.post("/users/cart/add", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['CART']
                    #swagger.description = 'Endpoint to add product in cart.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /*  #swagger.parameters['obj'] = {
                   in: 'body',
                   title: 'Some description...',
                   schema: {
                          $productId: "68ff099f446f75054505259a",
                          $price:"20" , 
                          $quantity: "2",
                          $size:"350ml"     
                       }
           } */

    if (expression) {
      // #swagger.responses[201] = { description: 'product added in cart successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/users/cart/list", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['CART']
            #swagger.description = 'Endpoint to get cart list.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'cart list found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.delete("/users/cart/removeCart/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['CART']
                    #swagger.description = 'Endpoint to reomove cart.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'cart removed successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.delete("/users/cart/clearCart", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['CART']
                    #swagger.description = 'Endpoint to reomove cart.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'cart removed successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/users/cart/increaseQuantity/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['CART']
                    #swagger.description = 'Endpoint to increase quantity.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /*  #swagger.parameters['obj'] = {
                   in: 'body',
                   title: 'Some description...',
                   schema: {
                         $quantity: "1"
                   }
           } */

    if (expression) {
      // #swagger.responses[201] = { description: 'cart increased successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/users/cart/decreaseQuantity/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['CART']
                    #swagger.description = 'Endpoint to increase quantity.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /*  #swagger.parameters['obj'] = {
                   in: 'body',
                   title: 'Some description...',
                   schema: {
                    $quantity: "1"
                 }
           } */

    if (expression) {
      // #swagger.responses[201] = { description: 'cart increased successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });

  /*Routes for wishlist*/
  app.post("/users/wishlist/add", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['WISHLIST']
                      #swagger.description = 'Endpoint to add wishlist.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /*  #swagger.parameters['obj'] = {
                     in: 'body',
                     title: 'Some description...',
                     schema: {
                            $productId: "666fe917aa6a0a8da98cb4c3",
                            $isWishlist: "true"
                         }
             } */

    if (expression) {
      // #swagger.responses[201] = { description: 'vote added successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/users/wishlist/list", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['WISHLIST']
                #swagger.description = 'Endpoint to get all wish list.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['pageNo'] = {
             in: 'query',
             description: 'Enter pageNo.'
            }
       */

    /* #swagger.parameters['pageLimit'] = {
             in: 'query',
             description: 'Enter pageLimit.'
            }
       */

    if (expression) {
      // #swagger.responses[201] = { description: 'wish list found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });

  /*Routes for address*/
  app.post("/users/address/add", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['ADDRESS']
                    #swagger.description = 'Endpoint to address.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /*  #swagger.parameters['obj'] = {
                   in: 'body',
                   title: 'Some description...',
                   schema: {
                          $name: "",
                          $countryCode: "",
                          $mobile: "",
                          $house: "",
                          $building: "",
                          $landMark: ""
                       }
           } */

    if (expression) {
      // #swagger.responses[201] = { description: 'address added successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/users/address/list", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['ADDRESS']
                    #swagger.description = 'Endpoint to get address list.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'address list found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/users/address/details/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['ADDRESS']
                    #swagger.description = 'Endpoint to get address details.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'address details found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/users/address/edit/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['ADDRESS']
                    #swagger.description = 'Endpoint to update address.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /*  #swagger.parameters['obj'] = {
                   in: 'body',
                   title: 'Some description...',
                   schema: {
                          $name: "",
                          $countryCode: "",
                          $mobile: "",
                          $house: "",
                          $building: "",
                          $landMark: ""
                       }
           } */

    if (expression) {
      // #swagger.responses[201] = { description: 'address updated successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/users/address/setDefault/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['ADDRESS']
                    #swagger.description = 'Endpoint to update address.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /*  #swagger.parameters['obj'] = {
                   in: 'body',
                   title: 'Some description...',
                   schema: {
                          $isDefault: "",
                       }
           } */

    if (expression) {
      // #swagger.responses[201] = { description: 'address updated successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.delete("/users/address/delete/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['ADDRESS']
                    #swagger.description = 'Endpoint to delete address.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'address deleted successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
};
