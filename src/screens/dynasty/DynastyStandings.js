import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { returnMongoCollection } from "database-management";
import { startCase } from "lodash";
import axios from "axios";

export const DynastyStandings = () => {
  const { era, year } = useParams();
  console.log("era", era, "year", year);

  return (
    <div>
      <h1>This is the template dynasty standings page</h1>
    </div>
  );
};
