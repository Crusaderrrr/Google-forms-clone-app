const sf = require("node-salesforce");
const express = require("express");
const router = express.Router();

router.post("/create-record", async (req, res) => {
  const { companyName, firstName, lastName, phone, email } = req.body;

  if (!companyName || !lastName || !email) {
    return res.status(400).json({
      success: false,
      message: "Company, Last Name, and Email are required.",
    });
  }

  const conn = new sf.Connection({
    loginUrl: process.env.SF_LOGIN_URL,
    version: "60.0",
  });

  try {
    await conn.login(
      process.env.SF_USERNAME,
      process.env.SF_PASSWORD + process.env.SF_TOKEN
    );

    const accountResult = await conn
      .sobject("Account")
      .create({ Name: companyName });

    if (!accountResult.success) {
      console.error("Error creating Account:", accountResult.errors);
      throw new Error("Could not create Salesforce Account.");
    }

    const newAccountId = accountResult.id;

    const contactResult = await conn.sobject("Contact").create({
      FirstName: firstName,
      LastName: lastName,
      Phone: phone,
      Email: email,
      AccountId: newAccountId,
    });

    if (!contactResult.success) {
      console.error("Error creating Contact:", contactResult.errors);
      throw new Error("Could not create Salesforce Contact.");
    }

    res.status(201).json({
      success: true,
      message: "Account and Contact created successfully in Salesforce.",
      salesforceIds: {
        accountId: newAccountId,
        contactId: contactResult.id,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "An error occurred with the Salesforce integration.",
    });
  }
});

module.exports = router;