import { BASE_URL, checkStatus, parseJSON } from "../utility/fetchUtilities";
import type { IRequest } from "./IRequest";

const url = `${BASE_URL}/requests`;

export const requestAPI = {
  list(status?: string): Promise<IRequest[]> {
    const query = status ? `?status=${status}` : "";
    return fetch(`${url}${query}`).then(checkStatus).then(parseJSON);
  },

  find(id: number): Promise<IRequest> {
    return fetch(`${url}/${id}`).then(checkStatus).then(parseJSON);
  },

  post(request: IRequest): Promise<IRequest> {
    return fetch(url, {
      method: "POST",
      body: JSON.stringify(request),
      headers: { "Content-Type": "application/json" },
    })
      .then(checkStatus)
      .then(parseJSON);
  },

  put(request: IRequest): Promise<IRequest> {
    return fetch(`${url}/${request.id}`, {
      method: "PUT",
      body: JSON.stringify(request),
      headers: { "Content-Type": "application/json" },
    })
      .then(checkStatus)
      .then(parseJSON);
  },

  delete(id: number) {
    return fetch(`${url}/${id}`, { method: "DELETE" }).then(checkStatus);
  },

  review(request: IRequest) {
    return fetch(`${url}/${request.id}/review`, {
      method: "PUT",
      body: JSON.stringify(request),
      headers: { "Content-Type": "application/json" },
    }).then(checkStatus);
  },

  approve(request: IRequest) {
    return fetch(`${url}/${request.id}/approve`, {
      method: "PUT",
      body: JSON.stringify(request),
      headers: { "Content-Type": "application/json" },
    }).then(checkStatus);
  },

  reject(request: IRequest) {
    return fetch(`${url}/${request.id}/reject`, {
      method: "PUT",
      body: JSON.stringify(request.rejectionReason),
      headers: { "Content-Type": "application/json" },
    }).then(checkStatus);
  },
};
