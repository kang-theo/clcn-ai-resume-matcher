import { useState, useEffect } from "react";
import axios from "axios";
import { catchClientRequestError } from "@/lib/utils";

interface IProps {
  roleId?: string;
}

function useRoles({
  roleId,
}: IProps): [API.Role[], { message: string } | null] {
  const [roles, setRoles] = useState<API.Role[]>([]);
  const [error, setError] = useState<{ message: string } | null>(null);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        let url = "/api/admin/system/roles";
        if (roleId) {
          url = `/api/admin/system/roles/${roleId}`;
        }

        const { data } = await axios(url);
        if (data.meta.code === "OK") {
          if (roleId) {
            setRoles([data.result]);
          } else {
            setRoles(data.result.records);
          }
        }
      } catch (error) {
        setError(catchClientRequestError(error));
      }
    };

    fetchRoles();
  }, [roleId]);

  return [roles, error];
}

export default useRoles;
