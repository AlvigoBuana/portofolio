export default defineNuxtConfig({
  css: ['../assets/styles.css'],
  app: {
    head: {
      title: 'Portofolio Alvigo',
      link: [
        // Hapus atau ganti link favicon yang lama jika ada,
        // lalu tambahkan baris ini:
        { rel: 'icon', type: 'image/png', href: '/awblogo2.png' } 
      ]
    }
  },
  // bisa tambah konfigurasi lain jika perlu
})
