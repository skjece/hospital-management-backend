var express = require("express");
var router = express.Router();

const fs = require("fs");

var HOSPITAL_LIST = require("../hospital-list.json");
var DEPARTMENT_LIST = require("../department-list.json");

router.get("/getHospitalsList", function (req, res, next) {
  setTimeout(() => {
    res
      .status(200)
      .json({ hospitals: HOSPITAL_LIST["hospitals"], status: "SUCCESS" });
  }, 1000);
});

router.post("/addHospital", function (req, res, next) {
  if (!req.body.contact || !req.body.name) {
    return res.status(400).json({ status: "BAD_REQUEST" });
  }

  let hospitalsList = HOSPITAL_LIST["hospitals"];

  let already_exist = false;
  hospitalsList.forEach((hospital) => {
    if (hospital.hospitalname === req.body.name) {
      already_exist = true;
    }
  });

  if (already_exist)
    return res.status(400).json({ status: "HOSPITAL_ALREADY_EXIST" });

  hospitalsList.push({
    hospitalname: req.body.name,
    contactnumber: req.body.contact,
  });

  let json = {
    hospitals: hospitalsList,
  };

  fs.writeFile("./hospital-list.json", JSON.stringify(json), (err) => {
    if (err) {
      //console.log("some error occured whi;le writing to file");
      res.status(500).json({ status: "FAILED" });
    } else {
      //console.log("written successfyully");
      res
        .status(200)
        .json({ hospitals: HOSPITAL_LIST["hospitals"], status: "SUCCESS" });
    }
  });
});

router.post("/deleteHospital", function (req, res, next) {
  if (!req.body.hospital) {
    return res.status(400).json({ status: "BAD_REQUEST" });
  }

  let hospitalsList = HOSPITAL_LIST["hospitals"];
  let initialHospitalsList = hospitalsList;

  let hospital_found = false;
  initialHospitalsList.forEach((hospital, index) => {
    if (hospital.hospitalname === req.body.hospital.hospitalname) {
      hospital_found = true;
      hospitalsList.splice(index, 1);
    }
  });

  if (!hospital_found)
    return res.status(400).json({ status: "HOSPITAL_NOT_FOUND" });

  let json = {
    hospitals: hospitalsList,
  };

  fs.writeFile("./hospital-list.json", JSON.stringify(json), (err) => {
    if (err) {
      //console.log("some error occured whi;le writing to file");
      res.status(500).json({ status: "FAILED" });
    } else {
      //console.log("written successfyully");
      res
        .status(200)
        .json({ hospitals: HOSPITAL_LIST["hospitals"], status: "SUCCESS" });
    }
  });
});

router.post("/updateHospital", function (req, res, next) {
  //console.log(req.body);
  if (!(req.body.old_name && req.body.new_name && req.body.new_contact)) {
    return res.status(400).json({ status: "BAD_REQUEST" });
  }

  let hospitalsList = HOSPITAL_LIST["hospitals"];
  let initialHospitalsList = hospitalsList;

  let hospital_found = false;
  initialHospitalsList.forEach((hospital, index) => {
    if (hospital.hospitalname === req.body.old_name) {
      hospital_found = true;
      hospital["hospitalname"] = req.body.new_name;
      hospital["contactnumber"] = req.body.new_contact;
    }
  });

  if (!hospital_found)
    return res.status(400).json({ status: "HOSPITAL_NOT_FOUND" });

  let json = {
    hospitals: hospitalsList,
  };

  fs.writeFile("./hospital-list.json", JSON.stringify(json), (err) => {
    if (err) {
      //console.log("some error occured whi;le writing to file");
      res.status(500).json({ status: "FAILED" });
    } else {
      //console.log("written successfyully");
      res
        .status(200)
        .json({ hospitals: HOSPITAL_LIST["hospitals"], status: "SUCCESS" });
    }
  });
});

//////////////////

router.get("/getDepartmentsList", function (req, res, next) {
  // //console.log(req.query)
  let filtered_departments = DEPARTMENT_LIST["departments"].filter(
    (department) => {
      return department.hospitalname == req.query.hospitalname ? true : false;
    }
  );

  setTimeout(() => {
    res
      .status(200)
      .json({ departments: filtered_departments, status: "SUCCESS" });
  }, 1000);
});

router.post("/addDepartment", function (req, res, next) {
  if (
    !(
      req.body.department_name &&
      req.body.head_name &&
      req.body.hospital_name &&
      req.body.contact
    )
  ) {
    return res.status(400).json({ status: "BAD_REQUEST" });
  }

  let departmentsList = DEPARTMENT_LIST["departments"];

  let already_exist = false;
  departmentsList.forEach((department) => {
    if (
      department.departmentname === req.body.department_name &&
      department.hospitalname === req.body.hospital_name
    ) {
      already_exist = true;
    }
  });

  if (already_exist)
    return res.status(400).json({ status: "DEPARTMENT_ALREADY_EXIST" });

  departmentsList.push({
    departmentname: req.body.department_name,
    contactnumber: req.body.contact,
    head: req.body.head_name,
    hospitalname: req.body.hospital_name,
  });

  let json = {
    departments: departmentsList,
  };

  fs.writeFile("./department-list.json", JSON.stringify(json), (err) => {
    if (err) {
      //console.log("some error occured whi;le writing to file");
      res.status(500).json({ status: "FAILED" });
    } else {
      //console.log("written successfyully");
      let filtered_departments = DEPARTMENT_LIST["departments"].filter(
        (department) => {
          return department.hospitalname == req.body.hospital_name
            ? true
            : false;
        }
      );
      return res
        .status(200)
        .json({ departments: filtered_departments, status: "SUCCESS" });
    }
  });
});

router.post("/deleteDepartment", function (req, res, next) {
  //console.log(req.body);
  if (!req.body.department) {
    return res.status(400).json({ status: "BAD_REQUEST" });
  }

  let departmentsList = DEPARTMENT_LIST["departments"];
  let initialDepartmentsList = departmentsList;

  let department_found = false;
  initialDepartmentsList.forEach((department, index) => {
    if (department.departmentname === req.body.department.departmentname) {
      department_found = true;
      departmentsList.splice(index, 1);
    }
  });

  if (!department_found)
    return res.status(400).json({ status: "DEPARTMENT_NOT_FOUND" });

  let json = {
    departments: departmentsList,
  };

  fs.writeFile("./department-list.json", JSON.stringify(json), (err) => {
    if (err) {
      //console.log("some error occured whi;le writing to file");
      res.status(500).json({ status: "FAILED" });
    } else {
      //console.log("written successfyully");
      let filtered_departments = DEPARTMENT_LIST["departments"].filter(
        (department) => {
          return department.hospitalname == req.body.department.hospitalname
            ? true
            : false;
        }
      );
      return res
        .status(200)
        .json({ departments: filtered_departments, status: "SUCCESS" });
    }
  });
});

router.post("/updateDepartment", function (req, res, next) {
  //console.log(req.body);
  if (
    !(
      req.body.old_department_name &&
      req.body.hospital_name &&
      req.body.new_department_name &&
      req.body.new_head_name &&
      req.body.new_contact
    )
  ) {
    return res.status(400).json({ status: "BAD_REQUEST" });
  }

  let departmentsList = DEPARTMENT_LIST["departments"];
  let initialDepartmentsList = departmentsList;

  let department_found = false;
  initialDepartmentsList.forEach((department, index) => {
    if (
      department.departmentname === req.body.old_department_name &&
      department.hospitalname == req.body.hospital_name
    ) {
      department_found = true;
      department["departmentname"] = req.body.new_department_name;
      department["head"] = req.body.new_head_name;
      department["contactnumber"] = req.body.new_contact;
    }
  });

  if (!department_found)
    return res.status(400).json({ status: "DEPARTMENT_NOT_FOUND" });

  let json = {
    departments: departmentsList,
  };

  fs.writeFile("./department-list.json", JSON.stringify(json), (err) => {
    if (err) {
      //console.log("some error occured whi;le writing to file");
      res.status(500).json({ status: "FAILED" });
    } else {
      //console.log("written successfyully");
      let filtered_departments = DEPARTMENT_LIST["departments"].filter(
        (department) => {
          return department.hospitalname == req.body.hospital_name
            ? true
            : false;
        }
      );
      return res
        .status(200)
        .json({ departments: filtered_departments, status: "SUCCESS" });
    }
  });
});

module.exports = router;
