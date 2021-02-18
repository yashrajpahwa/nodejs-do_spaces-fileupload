const url =
  'https://conceptometry.fra1.digitaloceanspaces.com/1613667661519deutsch-text-berufe.pdf';

console.log(
  `${url.split('digitaloceanspaces.com')[0]}cdn.digitaloceanspaces.com${
    url.split('digitaloceanspaces.com')[1]
  }`
);
