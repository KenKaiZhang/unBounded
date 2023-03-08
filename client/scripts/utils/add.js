export function addToNewsletter(email) {}

export async function addToWaitlist(values) {
  let partnerId = "";
  await fetch(`${baseUrl}/waitlist`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ownerName: values.ownerName,
      storeName: values.brandName,
      storeAddress: values.country,
      email: values.email,
      phone: values.phone,
      message: values.message,
    }),
  })
    .then((res) => res.json())
    .then(async (response) => {
      partnerId = response;
    });

  await fetch(`${baseUrl}/email/partnerRequest`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: partnerId,
      email: values.email,
      brand: values.brandName,
      message: values.message,
    }),
  }).then((res) => {
    return res.status == 200;
  });
}
