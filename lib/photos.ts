export interface PhotoConfig {
  src: string
  alt: string
  caption?: string
  width: number
  height: number
}

export const photos: Record<string, PhotoConfig[]> = {
  appartamento: [
    { src: '/images/photo_2026-03-07_19-54-46.jpg', alt: 'Appartamento di pregio - vista generale', width: 1920, height: 1280 },
  ],
  'camera-1': [
    { src: '/images/camera-1/05944757-D344-4273-9601-9DB4C6E44773.png', alt: 'Camera matrimoniale - vista 1', width: 1920, height: 1280 },
    { src: '/images/camera-1/14D1C049-AF75-4B95-B44B-67425FC7DBD8.png', alt: 'Camera matrimoniale - vista 2', width: 1920, height: 1280 },
    { src: '/images/camera-1/6DEF743A-7FD9-488C-983B-99A624231EE7.jpeg', alt: 'Camera matrimoniale - dettaglio', width: 1920, height: 1280 },
    { src: '/images/camera-1/EA7AE7E4-62A1-4458-9C1C-2DDC7646AA5D.png', alt: 'Camera matrimoniale - vista 3', width: 1920, height: 1280 },
    { src: '/images/camera-1/FF05794A-4B32-4AC1-90E9-B9E04F2141BD.png', alt: 'Camera matrimoniale - vista 4', width: 1920, height: 1280 },
  ],
  'camera-2': [
    { src: '/images/camera-2/664927D9-8ED4-481B-A083-708B2B5B3B1C.png', alt: 'Camera singola - vista 1', width: 1920, height: 1280 },
    { src: '/images/camera-2/AB69C5C0-BF49-4C04-89DE-A98F66B7A04F.png', alt: 'Camera singola - vista 2', width: 1920, height: 1280 },
  ],
  'camera-3': [],
  cucina: [
    { src: '/images/cucina/5D64C650-0CB8-48EF-8833-BBECC4E8DD37.png', alt: 'Cucina SMEG - vista 1', width: 1920, height: 1280 },
    { src: '/images/cucina/5F08B434-7EE9-4D5A-8F44-4319506ED29A.png', alt: 'Cucina SMEG - vista 2', width: 1920, height: 1280 },
    { src: '/images/cucina/82613C12-A8A9-4913-853A-3B0B00ECB20C.png', alt: 'Cucina SMEG - dettaglio', width: 1920, height: 1280 },
    { src: '/images/cucina/E1429E99-716D-48F6-A8C5-D3474D7568E8.png', alt: 'Cucina SMEG - vista 3', width: 1920, height: 1280 },
    { src: '/images/cucina/FECDE96F-8691-42C7-9190-5FC0D1C3F1D0.png', alt: 'Cucina SMEG - vista 4', width: 1920, height: 1280 },
  ],
  soggiorno: [
    { src: '/images/soggiorno/2802533F-D35A-4A86-91FC-E91C07B2A423.png', alt: 'Soggiorno - vista 1', width: 1920, height: 1280 },
    { src: '/images/soggiorno/E1429E99-716D-48F6-A8C5-D3474D7568E8.png', alt: 'Soggiorno - vista 2', width: 1920, height: 1280 },
  ],
  galleria: [],
  'bagno-condiviso': [
    { src: '/images/bagno-condiviso/0B08C374-FA30-4FFE-B416-C249C1DB73FB.png', alt: 'Bagno - vista 1', width: 1920, height: 1280 },
    { src: '/images/bagno-condiviso/1DE0C6CA-4582-45E9-8304-349A38D4EB99.png', alt: 'Bagno - vista 2', width: 1920, height: 1280 },
    { src: '/images/bagno-condiviso/C1EFFE56-13AE-4790-BD7D-44240CE0BBB8.png', alt: 'Bagno - dettaglio', width: 1920, height: 1280 },
    { src: '/images/bagno-condiviso/F1DA182D-7D58-4721-ABE2-4F73DAD6D40E.png', alt: 'Bagno - vista 3', width: 1920, height: 1280 },
    { src: '/images/bagno-condiviso/F2DBA053-75AC-4DFE-9937-E5B6A3ABE2C2.png', alt: 'Bagno - vista 4', width: 1920, height: 1280 },
  ],
}
