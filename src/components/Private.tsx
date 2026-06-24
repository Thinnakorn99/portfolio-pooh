import { useState, useMemo, useEffect } from 'react'
import './Private.css'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'

interface Card {
  id: string;
  name: string;
  category: 'Pokémon' | 'One Piece' | 'Yu-Gi-Oh!' | 'Magic: The Gathering';
  refId: string;
  grading: string; // e.g. "PSA 10", "BGS 9.5", "Raw"
  cost: number;
  status: 'available' | 'sold';
  image?: string;
  additionalImages?: string[]; // Up to 5 extra images
  salePrice?: number;
  shippingType?: 'pickup' | 'shipping';
  shippingCharged?: number;
  trackingNumber?: string;
  notes?: string;
  dateAdded: string;
  dateSold?: string;
  details?: string;
}

export default function Private() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'inventory' | 'add-card'>('dashboard')
  const [cards, setCards] = useState<Card[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/cards`)
        if (res.ok) {
          const json = await res.json()
          if (json.data) {
            setCards(json.data)
          }
        }
      } catch (err) {
        console.error('Failed to fetch cards:', err)
        showToast('ไม่สามารถดึงข้อมูลการ์ดได้ กำลังใช้ข้อมูลสำรอง', 'info')
      } finally {
        setIsLoading(false)
      }
    }
    fetchCards()
  }, [])

  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('All')
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'sold'>('all')

  // Form State for Add Card
  const [newCard, setNewCard] = useState<Partial<Card>>({
    name: '',
    category: 'One Piece',
    refId: '',
    grading: 'PSA 10 Gem Mint',
    cost: 0,
    image: '',
    details: '',
  })
  const [uploadPreview, setUploadPreview] = useState<string | null>(null)
  const [additionalPreviews, setAdditionalPreviews] = useState<(string | null)[]>([null, null, null, null, null])

  // Catalog thumbnail active index per card (keyed by card.id)
  const [activeThumbnail, setActiveThumbnail] = useState<Record<string, number>>({})

  // Sale Modal State
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false)
  const [selectedCardForSale, setSelectedCardForSale] = useState<Card | null>(null)
  const [salePrice, setSalePrice] = useState(0)
  const [shippingType, setShippingType] = useState<'pickup' | 'shipping' | ''>('')
  const [shippingCharged, setShippingCharged] = useState(0)
  const [trackingNumber, setTrackingNumber] = useState('')
  const [saleNotes, setSaleNotes] = useState('')
  const [saleActiveImageIdx, setSaleActiveImageIdx] = useState(0)

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedCardForEdit, setSelectedCardForEdit] = useState<Card | null>(null)

  const [editName, setEditName] = useState('')
  const [editCategory, setEditCategory] = useState<Card['category']>('One Piece')
  const [editRefId, setEditRefId] = useState('')
  const [editGrading, setEditGrading] = useState('')
  const [editCost, setEditCost] = useState(0)
  const [editImage, setEditImage] = useState('')
  const [editAdditionalImages, setEditAdditionalImages] = useState<(string | null)[]>([null, null, null, null, null])
  const [editDetails, setEditDetails] = useState('')

  const [editStatus, setEditStatus] = useState<'available' | 'sold'>('available')
  const [editSalePrice, setEditSalePrice] = useState(0)
  const [editShippingType, setEditShippingType] = useState<'pickup' | 'shipping' | ''>('')
  const [editShippingCharged, setEditShippingCharged] = useState(0)
  const [editTrackingNumber, setEditTrackingNumber] = useState('')
  const [editSaleNotes, setEditSaleNotes] = useState('')

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')
  const [editActiveImageIdx, setEditActiveImageIdx] = useState(0)

  // Toast Notification
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null)

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  // Prevent background jumping & scrolling when modal is open
  useEffect(() => {
    if (isSaleModalOpen || isEditModalOpen) {
      document.body.classList.add('cv-modal-open')
      document.documentElement.classList.add('cv-modal-open')
    } else {
      document.body.classList.remove('cv-modal-open')
      document.documentElement.classList.remove('cv-modal-open')
    }
    return () => {
      document.body.classList.remove('cv-modal-open')
      document.documentElement.classList.remove('cv-modal-open')
    }
  }, [isSaleModalOpen, isEditModalOpen])

  // Dashboard Stats Calculations (Thai Baht)
  const stats = useMemo(() => {
    const totalInventoryValue = cards
      .filter(c => c.status === 'available')
      .reduce((sum, c) => sum + c.cost, 0)

    const totalRevenue = cards
      .filter(c => c.status === 'sold')
      .reduce((sum, c) => sum + (c.salePrice || 0), 0)

    const totalShipping = cards
      .filter(c => c.status === 'sold')
      .reduce((sum, c) => sum + (c.shippingCharged || 0), 0)

    const totalCost = cards
      .filter(c => c.status === 'sold')
      .reduce((sum, c) => sum + c.cost, 0)

    const netProfit = totalRevenue - totalShipping - totalCost
    const margin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0

    return {
      totalInventoryValue,
      totalRevenue,
      totalCost,
      netProfit,
      margin
    }
  }, [cards])

  // Dynamic Chart Calculations
  const chartData = useMemo(() => {
    const soldCards = cards
      .filter(c => c.status === 'sold' && c.dateSold)
      .sort((a, b) => {
        const dateA = new Date(a.dateSold!).getTime();
        const dateB = new Date(b.dateSold!).getTime();
        return dateA - dateB;
      });

    let cumulative = 0;
    const dataPoints = [{ profit: 0, date: 'เริ่มต้น' }];

    if (soldCards.length === 0) {
      dataPoints.push({ profit: 0, date: 'ปัจจุบัน' });
    } else {
      soldCards.forEach(card => {
        const cardProfit = (card.salePrice || 0) - (card.shippingCharged || 0) - card.cost;
        cumulative += cardProfit;
        dataPoints.push({
          profit: cumulative,
          date: card.dateSold || ''
        });
      });
    }

    const leftMargin = 55;
    const rightMargin = 470;
    const topMargin = 25;
    const bottomMargin = 165;
    const width = rightMargin - leftMargin;
    const height = bottomMargin - topMargin;

    const profits = dataPoints.map(p => p.profit);
    const minP = Math.min(0, ...profits);
    const maxP = Math.max(1000, ...profits) * 1.1; // Add 10% padding to top

    const points = dataPoints.map((dp, index) => {
      const x = leftMargin + (index / (dataPoints.length - 1)) * width;
      const y = bottomMargin - ((dp.profit - minP) / (maxP - minP)) * height;
      return { x, y, profit: dp.profit, date: dp.date };
    });

    let linePath = '';
    let areaPath = '';
    if (points.length > 0) {
      linePath = `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ');
      areaPath = `${linePath} L ${points[points.length - 1].x} ${bottomMargin} L ${points[0].x} ${bottomMargin} Z`;
    }

    return {
      points,
      linePath,
      areaPath,
      minP,
      maxP,
      leftMargin,
      rightMargin,
      topMargin,
      bottomMargin
    };
  }, [cards]);

  const yLabels = useMemo(() => {
    const { minP, maxP, topMargin, bottomMargin } = chartData;
    const height = bottomMargin - topMargin;
    return [
      { y: topMargin + 4, value: maxP },
      { y: topMargin + height * 0.33 + 4, value: minP + (maxP - minP) * 0.66 },
      { y: topMargin + height * 0.66 + 4, value: minP + (maxP - minP) * 0.33 },
      { y: bottomMargin + 4, value: minP }
    ];
  }, [chartData]);

  // Filtered Cards for Catalog
  const filteredCards = useMemo(() => {
    return cards.filter(card => {
      const matchesSearch = card.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            card.refId.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = categoryFilter === 'All' || card.category === categoryFilter
      const matchesStatus = statusFilter === 'all' || card.status === statusFilter
      return matchesSearch && matchesCategory && matchesStatus
    })
  }, [cards, searchQuery, categoryFilter, statusFilter])

  // Format currency (Baht ฿)
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(val)
  }

  // Shorten large numbers (e.g. ฿1.24M)
  const formatShortCurrency = (val: number) => {
    if (val >= 1000000) {
      return `฿${(val / 1000000).toFixed(2)}M`
    } else if (val >= 1000) {
      return `฿${(val / 1000).toFixed(1)}K`
    }
    return formatCurrency(val)
  }

  // Handle Add Card Submit
  const handleAddCardSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCard.name || !newCard.refId) {
      showToast('กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน', 'info')
      return
    }

    const cardCost = Number(newCard.cost) || 0
    const cardToAdd = {
      name: newCard.name,
      category: newCard.category as Card['category'],
      refId: newCard.refId,
      grading: newCard.grading || 'Raw',
      cost: cardCost,
      status: 'available',
      image: uploadPreview || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80',
      additionalImages: additionalPreviews.filter(Boolean) as string[],
      dateAdded: new Date().toISOString().split('T')[0],
      details: newCard.details || '',
    }

    try {
      const res = await fetch(`${API_BASE_URL}/cards`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cardToAdd)
      })
      if (res.ok) {
        const json = await res.json()
        if (json.data) {
          setCards(prev => [json.data, ...prev])
          showToast(`เพิ่มการ์ด "${json.data.name}" เข้าคลังแล้ว`)
        }
      } else {
        showToast('ไม่สามารถบันทึกข้อมูลการ์ดลงฐานข้อมูลได้', 'info')
      }
    } catch (err) {
      console.error(err)
      showToast('เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล', 'info')
    }

    // Reset Form
    setNewCard({
      name: '',
      category: 'One Piece',
      refId: '',
      grading: 'PSA 10 Gem Mint',
      cost: 0,
      image: '',
      details: '',
    })
    setUploadPreview(null)
    setAdditionalPreviews([null, null, null, null, null])
    setActiveTab('inventory')
  }

  // Open Sale Modal
  const openSaleModal = (card: Card) => {
    setSelectedCardForSale(card)
    setSalePrice(0)
    setShippingType('')
    setShippingCharged(0)
    setTrackingNumber('')
    setSaleNotes('')
    setSaleActiveImageIdx(0)
    setIsSaleModalOpen(true)
  }

  // Confirm Sale
  const handleConfirmSale = async () => {
    if (!selectedCardForSale || !shippingType || salePrice <= 0) return

    const updatedFields = {
      ...selectedCardForSale,
      status: 'sold',
      salePrice,
      shippingType: shippingType as 'pickup' | 'shipping',
      shippingCharged: shippingType === 'shipping' ? shippingCharged : 0,
      trackingNumber: shippingType === 'shipping' ? trackingNumber : '',
      notes: saleNotes,
      dateSold: new Date().toISOString().split('T')[0]
    }

    try {
      const res = await fetch(`${API_BASE_URL}/cards/${selectedCardForSale.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields)
      })
      if (res.ok) {
        const json = await res.json()
        if (json.data) {
          setCards(prev => prev.map(c => c.id === json.data.id ? json.data : c))
          showToast(`บันทึกการขายการ์ด "${selectedCardForSale.name}" สำเร็จ!`)
        }
      } else {
        showToast('ไม่สามารถบันทึกข้อมูลการขายลงฐานข้อมูลได้', 'info')
      }
    } catch (err) {
      console.error(err)
      showToast('เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล', 'info')
    }

    setIsSaleModalOpen(false)
    setSelectedCardForSale(null)
  }

  // Open Edit Modal
  const openEditModal = (card: Card) => {
    setSelectedCardForEdit(card)
    setEditName(card.name)
    setEditCategory(card.category)
    setEditRefId(card.refId)
    setEditGrading(card.grading)
    setEditCost(card.cost)
    setEditImage(card.image || '')
    // Load existing additional images (pad to 5 slots)
    const existing = card.additionalImages || []
    setEditAdditionalImages([
      existing[0] || null,
      existing[1] || null,
      existing[2] || null,
      existing[3] || null,
      existing[4] || null,
    ])
    setEditDetails(card.details || '')
    setEditStatus(card.status)
    setEditSalePrice(card.salePrice || 0)
    setEditShippingType(card.shippingType || '')
    setEditShippingCharged(card.shippingCharged || 0)
    setEditTrackingNumber(card.trackingNumber || '')
    setEditSaleNotes(card.notes || '')

    setIsDeleteConfirmOpen(false)
    setDeleteConfirmText('')
    setEditActiveImageIdx(0)
    setIsEditModalOpen(true)
  }

  // Save Card Edits
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCardForEdit) return

    if (editStatus === 'sold' && (!editShippingType || editSalePrice <= 0)) {
      showToast('กรุณากรอกราคาขายและเลือกประเภทการจัดส่งให้ครบถ้วน', 'info')
      return
    }

    const updatedCard: any = {
      name: editName,
      category: editCategory,
      refId: editRefId,
      grading: editGrading,
      cost: Number(editCost) || 0,
      image: editImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80',
      additionalImages: editAdditionalImages.filter(Boolean) as string[],
      details: editDetails,
      status: editStatus,
    }

    if (editStatus === 'sold') {
      updatedCard.salePrice = Number(editSalePrice) || 0
      updatedCard.shippingType = editShippingType as 'pickup' | 'shipping'
      updatedCard.shippingCharged = editShippingType === 'shipping' ? (Number(editShippingCharged) || 0) : 0
      updatedCard.trackingNumber = editShippingType === 'shipping' ? editTrackingNumber : ''
      updatedCard.notes = editSaleNotes
      updatedCard.dateSold = selectedCardForEdit.dateSold || new Date().toISOString().split('T')[0]
    }

    try {
      const res = await fetch(`${API_BASE_URL}/cards/${selectedCardForEdit.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedCard)
      })
      if (res.ok) {
        const json = await res.json()
        if (json.data) {
          setCards(prev => prev.map(c => c.id === json.data.id ? json.data : c))
          showToast(`แก้ไขข้อมูลการ์ด "${editName}" สำเร็จ!`, 'success')
        }
      } else {
        showToast('ไม่สามารถบันทึกการแก้ไขลงฐานข้อมูลได้', 'info')
      }
    } catch (err) {
      console.error(err)
      showToast('เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล', 'info')
    }

    setIsEditModalOpen(false)
    setSelectedCardForEdit(null)
  }

  // Delete Card
  const handleDeleteCard = async () => {
    if (!selectedCardForEdit) return
    if (deleteConfirmText !== 'FLUKE88') {
      showToast('กรุณากรอกรหัสยืนยันให้ถูกต้อง', 'info')
      return
    }

    try {
      const res = await fetch(`${API_BASE_URL}/cards/${selectedCardForEdit.id}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        setCards(prev => prev.filter(c => c.id !== selectedCardForEdit.id))
        showToast(`ลบการ์ด "${selectedCardForEdit.name}" เรียบร้อยแล้ว`, 'success')
      } else {
        showToast('ไม่สามารถลบข้อมูลการ์ดออกจากฐานข้อมูลได้', 'info')
      }
    } catch (err) {
      console.error(err)
      showToast('เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล', 'info')
    }

    setIsEditModalOpen(false)
    setSelectedCardForEdit(null)
  }

  // Handle file upload selection (with compression to keep base64 small)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean = false, additionalIndex?: number) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      showToast('กรุณาเลือกไฟล์รูปภาพเท่านั้น', 'info')
      return
    }

    const img = new Image()
    const objectUrl = URL.createObjectURL(file)
    img.onload = () => {
      const MAX_SIZE = 600
      let w = img.width
      let h = img.height
      if (w > MAX_SIZE || h > MAX_SIZE) {
        const ratio = Math.min(MAX_SIZE / w, MAX_SIZE / h)
        w = Math.round(w * ratio)
        h = Math.round(h * ratio)
      }
      const canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, w, h)
      const dataUrl = canvas.toDataURL('image/jpeg', 0.75)
      URL.revokeObjectURL(objectUrl)

      if (additionalIndex !== undefined) {
        if (isEdit) {
          setEditAdditionalImages(prev => {
            const next = [...prev]
            next[additionalIndex] = dataUrl
            return next
          })
        } else {
          setAdditionalPreviews(prev => {
            const next = [...prev]
            next[additionalIndex] = dataUrl
            return next
          })
        }
        showToast(`อัปโหลดรูปที่ ${additionalIndex + 1} สำเร็จ`, 'success')
      } else {
        if (isEdit) {
          setEditImage(dataUrl)
          showToast('เปลี่ยนรูปภาพการ์ดสำเร็จ', 'success')
        } else {
          setUploadPreview(dataUrl)
          showToast('อัปโหลดรูปภาพการ์ดสำเร็จ', 'success')
        }
      }
    }
    img.src = objectUrl
  }

  return (
    <main className="cv-app">
      {/* Toast Notification */}
      {toast && (
        <div className={`cv-toast cv-toast--${toast.type}`}>
          <span>{toast.message}</span>
        </div>
      )}

      {/* Sidebar navigation */}
      <aside className="cv-sidebar">
        <div className="cv-sidebar__logo">
          <div className="logo-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M12 3v18M3 12h18" />
            </svg>
          </div>
          <div>
            <h1>CardVault Pro</h1>
            <span>ระบบบันทึกการ์ด</span>
          </div>
        </div>

        <nav className="cv-sidebar__menu" aria-label="Dashboard menu">
          <button
            className={`menu-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <svg className="menu-btn__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="9" rx="1" />
              <rect x="14" y="3" width="7" height="5" rx="1" />
              <rect x="14" y="12" width="7" height="9" rx="1" />
              <rect x="3" y="16" width="7" height="5" rx="1" />
            </svg>
            แดชบอร์ด
          </button>

          <button
            className={`menu-btn ${activeTab === 'inventory' ? 'active' : ''}`}
            onClick={() => {
              setStatusFilter('all')
              setActiveTab('inventory')
            }}
          >
            <svg className="menu-btn__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            คลังสินค้า
          </button>

          <button
            className={`menu-btn ${activeTab === 'add-card' ? 'active' : ''}`}
            onClick={() => setActiveTab('add-card')}
          >
            <svg className="menu-btn__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v8M8 12h8" />
            </svg>
            บันทึกการ์ดใหม่
          </button>

          <button
            className="menu-btn"
            onClick={() => showToast('ฟังก์ชันกำลังพัฒนาในโหมดโปรเจกต์ทดสอบ', 'info')}
          >
            <svg className="menu-btn__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
            ตั้งค่า
          </button>
        </nav>

        <div className="cv-sidebar__footer">
          <button
            className="add-card-quick"
            onClick={() => setActiveTab('add-card')}
          >
            <span>+ เพิ่มการ์ดใหม่</span>
          </button>
          <a href="/" className="exit-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            ออกหน้าแอป
          </a>
        </div>
      </aside>

      {/* Main Container */}
      <div className="cv-main">
        {/* Top Navbar */}
        <header className="cv-navbar">
          {activeTab === 'inventory' && (
            <div className="cv-navbar__search">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder="ค้นหาในคลัง..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          )}

          <div className="cv-navbar__actions">
            <button className="nav-icon-btn" aria-label="Notifications" onClick={() => showToast('ไม่มีการแจ้งเตือนใหม่', 'info')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <span className="dot" />
            </button>

            <button className="nav-icon-btn" aria-label="Help" onClick={() => showToast('CardVault Pro v2.4.1', 'info')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01" />
              </svg>
            </button>

            <div className="profile-badge">
              <img
                src="https://api.dicebear.com/9.x/pixel-art/png?seed=MheePooh&backgroundColor=c0e0ff,1e1b4b&radius=50"
                alt="Profile"
              />
            </div>
          </div>
        </header>

        {isLoading ? (
          <div className="cv-loading-container">
            <div className="cv-loading-spinner" />
            <p>กำลังโหลดข้อมูล...</p>
          </div>
        ) : (
          <>
            {/* Dashboard Tab Content */}
            {activeTab === 'dashboard' && (
              <div className="cv-content fade-in">
                <div className="cv-content__header">
                  <div>
                    <h2>ภาพรวม</h2>
                    <p>ตัวชี้วัดแบบเรียลไทม์สำหรับยอดซื้อขายของคุณ</p>
                  </div>
                </div>

                {/* Metrics cards grid */}
                <div className="cv-metrics-grid">
                  <div className="cv-metric-card cyan">
                    <div className="cv-metric-card__header">
                      <span>มูลค่าคลังสินค้าทั้งหมด</span>
                      <div className="card-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                          <path d="M21 12H3" />
                        </svg>
                      </div>
                    </div>
                    <h3>{formatShortCurrency(stats.totalInventoryValue)}</h3>
                    <span className="trend positive">▲ 2.4% <span className="trend-text">เทียบกับเดือนก่อน</span></span>
                  </div>

                  <div className="cv-metric-card purple">
                    <div className="cv-metric-card__header">
                      <span>รายได้รวม</span>
                      <div className="card-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                          <rect x="2" y="4" width="20" height="16" rx="2" />
                          <path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
                        </svg>
                      </div>
                    </div>
                    <h3>{formatShortCurrency(stats.totalRevenue)}</h3>
                    <span className="trend positive">▲ 8.1% <span className="trend-text">ภาพรวมทั้งหมด</span></span>
                  </div>

                  <div className="cv-metric-card red">
                    <div className="cv-metric-card__header">
                      <span>ต้นทุนรวม</span>
                      <div className="card-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                          <rect x="2" y="4" width="20" height="16" rx="2" />
                          <line x1="12" y1="20" x2="12" y2="4" />
                        </svg>
                      </div>
                    </div>
                    <h3>{formatShortCurrency(stats.totalCost)}</h3>
                    <span className="trend negative">▼ 0.5% <span className="trend-text">ภาพรวมทั้งหมด</span></span>
                  </div>

                  <div className="cv-metric-card green">
                    <div className="cv-metric-card__header">
                      <span>กำไรสุทธิ</span>
                      <div className="card-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                          <path d="M23 6l-9.5 9.5-5-5L1 18" />
                        </svg>
                      </div>
                    </div>
                    <h3>{formatShortCurrency(stats.netProfit)}</h3>
                    <span className="trend positive">
                      ▲ {stats.margin.toFixed(1)}% <span className="trend-text">อัตรากำไรสะสม</span>
                    </span>
                  </div>
                </div>

                {/* Dashboard Visual Panels */}
                <div className="cv-panel-row">
                  {/* Performance chart */}
                  <div className="cv-panel cv-panel--chart">
                    <div className="cv-panel__header">
                      <h4>ประสิทธิภาพการดำเนินงาน (ตลอดกาล)</h4>
                    </div>
                    <div className="cv-chart-container">
                      <svg className="spark-line-chart" viewBox="0 0 500 200">
                        <defs>
                          <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#0088cc" stopOpacity="0.25" />
                            <stop offset="100%" stopColor="#0088cc" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>

                        <line x1={chartData.leftMargin} y1={chartData.topMargin} x2={chartData.rightMargin} y2={chartData.topMargin} stroke="#e2e8f0" strokeDasharray="3 3" />
                        <line x1={chartData.leftMargin} y1={chartData.topMargin + (chartData.bottomMargin - chartData.topMargin) * 0.33} x2={chartData.rightMargin} y2={chartData.topMargin + (chartData.bottomMargin - chartData.topMargin) * 0.33} stroke="#e2e8f0" strokeDasharray="3 3" />
                        <line x1={chartData.leftMargin} y1={chartData.topMargin + (chartData.bottomMargin - chartData.topMargin) * 0.66} x2={chartData.rightMargin} y2={chartData.topMargin + (chartData.bottomMargin - chartData.topMargin) * 0.66} stroke="#e2e8f0" strokeDasharray="3 3" />
                        <line x1={chartData.leftMargin} y1={chartData.bottomMargin} x2={chartData.rightMargin} y2={chartData.bottomMargin} stroke="#cbd5e1" />

                        {chartData.linePath && (
                          <>
                            <path
                              className="chart-area"
                              d={chartData.areaPath}
                              fill="url(#chartGrad)"
                            />
                            <path
                              className="chart-line"
                              d={chartData.linePath}
                              fill="none"
                              stroke="#0088cc"
                              strokeWidth="3"
                              strokeLinecap="round"
                            />
                          </>
                        )}

                        {chartData.points.map((p, idx) => (
                          <g key={idx} className="chart-point-group">
                            <circle
                              cx={p.x}
                              cy={p.y}
                              r={idx === chartData.points.length - 1 ? "5" : "3"}
                              fill="#0088cc"
                              stroke="#ffffff"
                              strokeWidth={idx === chartData.points.length - 1 ? "2" : "1"}
                            />
                            <title>{`${p.date}: ${formatCurrency(p.profit)}`}</title>
                          </g>
                        ))}

                        {yLabels.map((lbl, idx) => (
                          <text
                            key={idx}
                            x={chartData.leftMargin - 10}
                            y={lbl.y}
                            fill="rgba(15,23,42,0.4)"
                            fontSize="10"
                            textAnchor="end"
                          >
                            {formatShortCurrency(lbl.value)}
                          </text>
                        ))}
                      </svg>
                    </div>
                  </div>

                  {/* Recent Sales List */}
                  <div className="cv-panel cv-panel--sales">
                    <div className="cv-panel__header">
                      <h4>รายการขายล่าสุด</h4>
                      <button onClick={() => {
                        setStatusFilter('sold')
                        setActiveTab('inventory')
                      }}>ดูทั้งหมด</button>
                    </div>
                    <div className="cv-sales-list">
                      {cards
                        .filter(c => c.status === 'sold')
                        .sort((a, b) => {
                          const dateA = new Date(a.dateSold || a.dateAdded).getTime()
                          const dateB = new Date(b.dateSold || b.dateAdded).getTime()
                          return dateB - dateA
                        })
                        .slice(0, 4)
                        .map(card => {
                          const profit = (card.salePrice || 0) - (card.shippingCharged || 0) - card.cost
                          return (
                            <div className="sale-item" key={card.id}>
                              <div className="sale-item__image">
                                <img src={card.image} alt={card.name} />
                              </div>
                              <div className="sale-item__details">
                                <h5>{card.name}</h5>
                                <span>{card.grading} • ID: #{card.refId}</span>
                              </div>
                              <div className="sale-item__price">
                                <strong>{formatCurrency(card.salePrice || 0)}</strong>
                                <span className="profit-indicator">▲ {formatCurrency(profit)}</span>
                              </div>
                            </div>
                          )
                        })}
                      {cards.filter(c => c.status === 'sold').length === 0 && (
                        <div className="empty-sales">
                          <p>ยังไม่มีรายการขายในระบบ</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Inventory Catalog Tab Content */}
            {activeTab === 'inventory' && (
              <div className="cv-content cv-content--inventory fade-in">
                <div className="cv-content__header">
                  <div>
                    <h2>คลังเก็บการ์ด</h2>
                    <p>จัดการและติดตามทรัพย์สินสะสมของคุณ</p>
                  </div>
                </div>

                {/* Filters Tabs and Status selector */}
                <div className="cv-filter-bar">
                  <div className="category-tabs">
                    {['All', 'One Piece'].map(cat => (
                      <button
                        key={cat}
                        className={`tab-btn ${categoryFilter === cat ? 'active' : ''}`}
                        onClick={() => setCategoryFilter(cat)}
                      >
                        {cat === 'All' ? 'สินค้าทั้งหมด' : cat}
                      </button>
                    ))}
                  </div>

                  <div className="status-selector">
                    <button
                      className={`status-btn ${statusFilter === 'all' ? 'active' : ''}`}
                      onClick={() => setStatusFilter('all')}
                    >
                      ทั้งหมด
                    </button>
                    <button
                      className={`status-btn ${statusFilter === 'available' ? 'active' : ''}`}
                      onClick={() => setStatusFilter('available')}
                    >
                      พร้อมขาย
                    </button>
                    <button
                      className={`status-btn ${statusFilter === 'sold' ? 'active' : ''}`}
                      onClick={() => setStatusFilter('sold')}
                    >
                      ขายแล้ว
                    </button>
                  </div>
                </div>

                {/* Cards Grid */}
                <div className="cv-cards-grid">
                  {filteredCards.map(card => {
                    const allImages = [card.image, ...(card.additionalImages || [])].filter(Boolean) as string[]
                    const activeIdx = activeThumbnail[card.id] ?? 0
                    const displayImage = allImages[activeIdx] || card.image
                    return (
                      <div className={`card-item ${card.status === 'sold' ? 'sold' : ''}`} key={card.id}>
                        <div className="card-item__image-wrap">
                          <img src={displayImage} alt={card.name} loading="lazy" />
                          <span className="card-badge">{card.grading}</span>
                          {card.status === 'sold' && (
                            <div className="sold-overlay">
                              <span>🔒 จบรายการแล้ว</span>
                            </div>
                          )}
                        </div>

                        {/* Thumbnail strip - shown only if there are additional images */}
                        {allImages.length > 1 && (
                          <div className="card-thumb-strip">
                            {allImages.map((img, idx) => (
                              <button
                                key={idx}
                                className={`thumb-btn ${activeIdx === idx ? 'active' : ''}`}
                                onClick={() => setActiveThumbnail(prev => ({ ...prev, [card.id]: idx }))}
                                title={idx === 0 ? 'รูปหลัก' : `รูปที่ ${idx + 1}`}
                              >
                                <img src={img} alt={`thumb-${idx}`} />
                              </button>
                            ))}
                          </div>
                        )}

                        <div className="card-item__body">
                          <span className="meta">BASE SET • {card.dateAdded.split('-')[0]} <span className="ref">ID: {card.refId}</span></span>
                          <h4>{card.name}</h4>
                          <p className="card-details-preview">{card.details || 'ไม่มีรายละเอียดเพิ่มเติม'}</p>

                          <div className="price-row">
                            <div className="price-col">
                              <span>ราคาทุน</span>
                              <strong>{formatCurrency(card.cost)}</strong>
                            </div>
                          </div>

                          <div className="card-item__actions">
                            {card.status === 'available' ? (
                              <>
                                <button
                                  className="btn-sell"
                                  onClick={() => openSaleModal(card)}
                                >
                                  💸 บันทึกการขาย
                                </button>
                                <button
                                  className="btn-edit-action"
                                  onClick={() => openEditModal(card)}
                                  title="แก้ไขรายละเอียด"
                                >
                                  ⚙️ แก้ไข
                                </button>
                              </>
                            ) : (
                              <div className="sold-actions-row">
                                <div className="sold-details">
                                  <span className="label">ราคาสุทธิที่ขายได้:</span>
                                  <span className="value">{formatCurrency(card.salePrice || 0)}</span>
                                </div>
                                <button
                                  className="btn-edit-action btn-edit-sold"
                                  onClick={() => openEditModal(card)}
                                  title="แก้ไขรายละเอียด"
                                >
                                  ⚙️ แก้ไข
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                  {filteredCards.length === 0 && (
                    <div className="empty-catalog">
                      <p>ไม่พบรายการการ์ดที่คุณกำลังค้นหา</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Add Card Form Tab Content */}
            {activeTab === 'add-card' && (
              <div className="cv-content fade-in">
                <div className="form-container">
                  <div className="form-header">
                    <span className="breadcrumb">Inventory &gt; Add New Card</span>
                    <h2>บันทึกการรับทรัพย์สินใหม่</h2>
                    <p>กรอกรายละเอียดที่ครบถ้วนสำหรับการ์ดสะสมใหม่เพื่อบันทึกเข้าคลัง</p>
                  </div>

                  <form onSubmit={handleAddCardSubmit} className="cv-form cv-form--one-frame">
                    <div className="form-side-by-side">
                      {/* Left Column: Image uploader */}
                      <div className="image-upload-column">
                        <input
                          id="add-card-file-input"
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, false)}
                          style={{ display: 'none' }}
                        />
                        <div
                          className="image-upload-area"
                          onClick={() => document.getElementById('add-card-file-input')?.click()}
                        >
                          {uploadPreview ? (
                            <div className="upload-preview-wrap">
                              <img src={uploadPreview} alt="Preview" />
                              <div className="upload-hover">
                                <span>คลิกเพื่อเปลี่ยนรูปภาพ</span>
                              </div>
                            </div>
                          ) : (
                            <div className="upload-placeholder">
                              <div className="upload-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
                                  <rect x="3" y="3" width="18" height="18" rx="2" />
                                  <circle cx="8.5" cy="8.5" r="1.5" />
                                  <path d="M21 15l-5-5L5 21" />
                                </svg>
                              </div>
                              <strong>อัปโหลดรูปภาพ</strong>
                              <p>ลากวางหรือคลิกเพื่ออัปโหลด</p>
                            </div>
                          )}
                        </div>

                        {/* Additional 5 thumbnail slots */}
                        <div className="additional-thumbs-row">
                          {[0, 1, 2, 3, 4].map(idx => (
                            <div key={idx} className="additional-thumb-slot">
                              <input
                                id={`add-extra-img-${idx}`}
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileChange(e, false, idx)}
                                style={{ display: 'none' }}
                              />
                              <div
                                className={`thumb-upload-box ${additionalPreviews[idx] ? 'has-image' : ''}`}
                                onClick={() => document.getElementById(`add-extra-img-${idx}`)?.click()}
                              >
                                {additionalPreviews[idx] ? (
                                  <img src={additionalPreviews[idx]!} alt={`extra-${idx}`} />
                                ) : (
                                  <span className="thumb-plus">+</span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Right Column: Inputs */}
                      <div className="form-inputs-column">
                        <div className="form-group">
                          <label htmlFor="card-name">ชื่อการ์ด <span className="required">*</span></label>
                          <input
                            id="card-name"
                            type="text"
                            placeholder="เช่น ลิซาร์ดอน..."
                            value={newCard.name}
                            onChange={(e) => setNewCard(prev => ({ ...prev, name: e.target.value }))}
                            required
                          />
                        </div>

                        <div className="form-row-group">
                          <div className="form-group">
                            <label htmlFor="card-category">ประเภทการ์ด/เกม</label>
                            <select
                              id="card-category"
                              value={newCard.category}
                              onChange={(e) => setNewCard(prev => ({ ...prev, category: e.target.value as Card['category'] }))}
                            >
                              <option value="One Piece">One Piece</option>
                            </select>
                          </div>

                          <div className="form-group">
                            <label htmlFor="card-ref">เลขการ์ด / รหัสอ้างอิง <span className="required">*</span></label>
                            <input
                              id="card-ref"
                              type="text"
                              placeholder="เช่น e.g., 4/102"
                              value={newCard.refId}
                              onChange={(e) => setNewCard(prev => ({ ...prev, refId: e.target.value }))}
                              required
                            />
                          </div>
                        </div>

                        <div className="form-row-group">
                          <div className="form-group">
                            <label htmlFor="card-grade">สถานะการเกรดและสภาพการ์ด</label>
                            <select
                              id="card-grade"
                              value={newCard.grading}
                              onChange={(e) => setNewCard(prev => ({ ...prev, grading: e.target.value }))}
                            >
                              <optgroup label="PSA Grades">
                                <option value="PSA 10 Gem Mint">PSA 10 Gem Mint</option>
                                <option value="PSA 9 Mint">PSA 9 Mint</option>
                                <option value="PSA 8 Near Mint-Mint">PSA 8 Near Mint-Mint</option>
                                <option value="PSA 7 Near Mint">PSA 7 Near Mint</option>
                                <option value="PSA 6 Excellent-Mint">PSA 6 Excellent-Mint</option>
                                <option value="PSA 5 Excellent">PSA 5 Excellent</option>
                                <option value="PSA 4 Very Good-Excellent">PSA 4 Very Good-Excellent</option>
                                <option value="PSA 3 Very Good">PSA 3 Very Good</option>
                                <option value="PSA 2 Good">PSA 2 Good</option>
                                <option value="PSA 1 Poor">PSA 1 Poor</option>
                              </optgroup>
                              <optgroup label="BGS Grades">
                                <option value="BGS 10 Black Label">BGS 10 Black Label</option>
                                <option value="BGS 10 Pristine">BGS 10 Pristine</option>
                                <option value="BGS 9.5 Gem Mint">BGS 9.5 Gem Mint</option>
                                <option value="BGS 9 Mint">BGS 9 Mint</option>
                                <option value="BGS 8.5 NM-Mint+">BGS 8.5 NM-Mint+</option>
                                <option value="BGS 8 Near Mint">BGS 8 Near Mint</option>
                                <option value="BGS 7.5 Excellent-Mint+">BGS 7.5 Excellent-Mint+</option>
                                <option value="BGS 7 Excellent">BGS 7 Excellent</option>
                              </optgroup>
                              <optgroup label="CGC Grades">
                                <option value="CGC 10 Pristine">CGC 10 Pristine</option>
                                <option value="CGC 9.5 Gem Mint">CGC 9.5 Gem Mint</option>
                                <option value="CGC 9 Mint">CGC 9 Mint</option>
                                <option value="CGC 8.5 NM-Mint+">CGC 8.5 NM-Mint+</option>
                                <option value="CGC 8 Near Mint">CGC 8 Near Mint</option>
                              </optgroup>
                              <optgroup label="Raw / Ungraded">
                                <option value="Raw (Near Mint or Better)">Raw (Near Mint or Better)</option>
                                <option value="Raw (Excellent)">Raw (Excellent)</option>
                                <option value="Raw (Played)">Raw (Played)</option>
                                <option value="Raw (Poor)">Raw (Poor)</option>
                              </optgroup>
                            </select>
                          </div>

                          <div className="form-group">
                            <label htmlFor="card-cost">ต้นทุนที่ซื้อมา (฿)</label>
                            <input
                              id="card-cost"
                              type="number"
                              placeholder="฿ 0"
                              value={newCard.cost || ''}
                              onChange={(e) => setNewCard(prev => ({ ...prev, cost: Number(e.target.value) }))}
                            />
                          </div>
                        </div>

                        <div className="form-group" style={{ marginTop: '8px' }}>
                          <label htmlFor="card-details">รายละเอียดเพิ่มเติม / สภาพการ์ด</label>
                          <textarea
                            id="card-details"
                            placeholder="ระบุตำหนิการ์ด สภาพรอยขีดข่วน มุม หรือข้อมูลการซื้อเพิ่มเติมได้ที่นี่..."
                            value={newCard.details || ''}
                            onChange={(e) => setNewCard(prev => ({ ...prev, details: e.target.value }))}
                            rows={2}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="form-actions">
                      <button
                        type="button"
                        className="btn-cancel"
                        onClick={() => setActiveTab('inventory')}
                      >
                        ยกเลิก
                      </button>
                      <button type="submit" className="btn-submit">
                        เพิ่มลงคลังสินค้า
                      </button>
                    </div>
                  </form>

                  <div className="form-footer-note text-center">
                    <span>CardVault Pro Institutional Trading System v2.4.1</span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Sale Modal / Side Drawer */}
      {isSaleModalOpen && selectedCardForSale && (
        <div className="sale-modal-overlay" onClick={() => setIsSaleModalOpen(false)}>
          <div className="ecom-modal-content" onClick={(e) => e.stopPropagation()}>
            <header className="ecom-modal-header">
              <div className="modal-title">
                <span>รายละเอียดทรัพย์สิน</span>
              </div>
              <button className="close-btn" onClick={() => setIsSaleModalOpen(false)} aria-label="Close modal">×</button>
            </header>

            <div className="ecom-modal-body">
              {/* LEFT: Image Gallery */}
              {(() => {
                const saleAllImages = [selectedCardForSale.image, ...(selectedCardForSale.additionalImages || [])].filter(Boolean) as string[]
                const saleDisplayImg = saleAllImages[saleActiveImageIdx] || selectedCardForSale.image
                return (
                  <div className="ecom-gallery-panel">
                    <div className="ecom-main-image">
                      <img src={saleDisplayImg} alt={selectedCardForSale.name} />
                      <span className="ecom-grade-badge">{selectedCardForSale.grading}</span>
                    </div>

                    {saleAllImages.length > 1 && (
                      <div className="ecom-thumb-strip">
                        {saleAllImages.map((img, idx) => (
                          <button
                            key={idx}
                            type="button"
                            className={`ecom-thumb-btn ${saleActiveImageIdx === idx ? 'active' : ''}`}
                            onClick={() => setSaleActiveImageIdx(idx)}
                          >
                            <img src={img} alt={`thumb-${idx}`} />
                          </button>
                        ))}
                      </div>
                    )}

                    <div className="ecom-card-identity">
                      <span className="ecom-category-tag">{selectedCardForSale.category} • {selectedCardForSale.grading}</span>
                      <h2 className="ecom-card-name">{selectedCardForSale.name}</h2>
                      <span className="ecom-ref-tag">ID: #{selectedCardForSale.refId}</span>
                      <div className="ecom-cost-row">
                        <span className="ecom-cost-label">ต้นทุนที่ซื้อมา</span>
                        <span className="ecom-cost-value">{formatCurrency(selectedCardForSale.cost)}</span>
                      </div>
                      {selectedCardForSale.details && (
                        <p className="ecom-details-text">{selectedCardForSale.details}</p>
                      )}
                    </div>
                  </div>
                )
              })()}

              {/* RIGHT: Sale Form */}
              <div className="ecom-form-panel">
                <div className="ecom-form-scrollable">
                  <div className="ecom-form-heading">
                    <h3>บันทึกการขาย</h3>
                    <p>กรอกรายละเอียดเพื่ออัปเดตสถานะและบันทึกรายรับ</p>
                  </div>

                  <div className="modal-form-group">
                    <label>ราคาที่ขายได้ (รายรับรวม)</label>
                    <div className="input-with-currency">
                      <span>฿</span>
                      <input
                        type="number"
                        value={salePrice || ''}
                        onChange={(e) => setSalePrice(Number(e.target.value))}
                      />
                    </div>
                  </div>

                  <div className="modal-form-row">
                    <div className="modal-form-group">
                      <label>ประเภทการจัดส่ง</label>
                      <select
                        value={shippingType}
                        onChange={(e) => {
                          const type = e.target.value as 'pickup' | 'shipping' | '';
                          setShippingType(type);
                          if (type === 'pickup' || type === '') {
                            setShippingCharged(0);
                          }
                        }}
                      >
                        <option value="">เลือกการจัดส่ง</option>
                        <option value="shipping">ขนส่ง</option>
                        <option value="pickup">นัดรับ</option>
                      </select>
                    </div>

                    <div className="modal-form-group">
                      <label>ค่าส่ง</label>
                      <div className="input-with-currency">
                        <span>฿</span>
                        <input
                          type="number"
                          value={shippingCharged || ''}
                          onChange={(e) => setShippingCharged(Number(e.target.value))}
                          disabled={shippingType === 'pickup' || shippingType === ''}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Tracking Number */}
                  <div className="modal-form-group">
                    <label>หมายเลขติดตามพัสดุ</label>
                    <div className={`input-with-icon ${shippingType === 'pickup' ? 'disabled' : ''}`}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                        <rect x="1" y="3" width="15" height="13" />
                        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                        <circle cx="5.5" cy="18.5" r="2.5" />
                        <circle cx="18.5" cy="18.5" r="2.5" />
                      </svg>
                      <input
                        type="text"
                        placeholder={shippingType === 'pickup' ? "ไม่ต้องใช้สำหรับนัดรับ" : "เช่น e.g., 1Z9999W99999999999"}
                        value={trackingNumber}
                        onChange={(e) => setTrackingNumber(e.target.value)}
                        disabled={shippingType === 'pickup'}
                      />
                    </div>
                  </div>

                  <div className="modal-form-group">
                    <label>หมายเหตุรายการ</label>
                    <textarea
                      placeholder="ความต้องการของลูกค้า ค่าธรรมเนียมแพลตฟอร์ม ฯลฯ"
                      value={saleNotes}
                      onChange={(e) => setSaleNotes(e.target.value)}
                      rows={3}
                    />
                  </div>

                  {/* Profit Summary */}
                  {(() => {
                    const netProfitVal = salePrice - (shippingType === 'shipping' ? shippingCharged : 0) - selectedCardForSale.cost;
                    const isLoss = netProfitVal < 0;
                    return (
                      <div className={`sale-summary-card ${isLoss ? 'loss' : 'profit'}`}>
                        <div className="summary-row">
                          <span>กำไรสุทธิโดยประมาณ</span>
                        </div>
                        <strong className="profit-value">{formatCurrency(netProfitVal)}</strong>
                        <span className="formula">
                          {shippingType === 'shipping' ? '(รายได้ - ค่าส่ง) - ต้นทุน' : 'รายได้ - ต้นทุน'}
                        </span>
                      </div>
                    );
                  })()}
                </div>

                <div className="ecom-form-footer">
                  <button
                    className="confirm-sale-btn"
                    onClick={handleConfirmSale}
                    disabled={!shippingType || salePrice <= 0}
                  >
                    ✓ ยืนยันการขาย
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal — E-Commerce Style */}
      {isEditModalOpen && selectedCardForEdit && (
        <div className="sale-modal-overlay" onClick={() => setIsEditModalOpen(false)}>
          <div className="ecom-modal-content ecom-edit-modal" onClick={(e) => e.stopPropagation()}>
            <header className="ecom-modal-header">
              <div className="modal-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                <span>ดูและแก้ไขรายละเอียดการ์ด</span>
              </div>
              <button className="close-btn" onClick={() => setIsEditModalOpen(false)} aria-label="Close modal">×</button>
            </header>

            <form onSubmit={handleSaveEdit} className="ecom-modal-body">
              {/* LEFT: Image Gallery + Upload */}
              {(() => {
                const editAllImages = [editImage, ...editAdditionalImages.filter(Boolean)].filter(Boolean) as string[]
                const editDisplayImg = editAllImages[editActiveImageIdx] || editImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80'
                return (
                  <div className="ecom-gallery-panel ecom-gallery-edit">
                    {/* Hidden file inputs */}
                    <input id="edit-card-file-input" type="file" accept="image/*" onChange={(e) => handleFileChange(e, true)} style={{ display: 'none' }} />
                    {[0, 1, 2, 3, 4].map(idx => (
                      <input key={idx} id={`edit-extra-img-${idx}`} type="file" accept="image/*" onChange={(e) => handleFileChange(e, true, idx)} style={{ display: 'none' }} />
                    ))}

                    {/* Main large image — click to upload main */}
                    <div
                      className="ecom-main-image clickable-upload"
                      onClick={() => {
                        if (editActiveImageIdx === 0) {
                          document.getElementById('edit-card-file-input')?.click()
                        } else {
                          document.getElementById(`edit-extra-img-${editActiveImageIdx - 1}`)?.click()
                        }
                      }}
                    >
                      <img src={editDisplayImg} alt={editName} />
                      <span className="ecom-grade-badge">{editGrading}</span>
                      <div className="ecom-upload-hover">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="17 8 12 3 7 8" />
                          <line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                        <span>คลิกเพื่อเปลี่ยนรูปภาพ</span>
                      </div>
                    </div>

                    {/* Thumbnail strip — main + 5 extra slots */}
                    <div className="ecom-thumb-strip">
                      <button
                        type="button"
                        className={`ecom-thumb-btn ${editActiveImageIdx === 0 ? 'active' : ''}`}
                        onClick={() => setEditActiveImageIdx(0)}
                        title="รูปหลัก"
                      >
                        {editImage ? (
                          <img src={editImage} alt="main" />
                        ) : (
                          <span className="ecom-thumb-plus">+</span>
                        )}
                      </button>

                      {[0, 1, 2, 3, 4].map(idx => (
                        <button
                          key={idx}
                          type="button"
                          className={`ecom-thumb-btn ${editActiveImageIdx === idx + 1 ? 'active' : ''} ${!editAdditionalImages[idx] ? 'empty-slot' : ''}`}
                          onClick={() => {
                            setEditActiveImageIdx(idx + 1)
                            if (!editAdditionalImages[idx]) {
                              document.getElementById(`edit-extra-img-${idx}`)?.click()
                            }
                          }}
                          title={editAdditionalImages[idx] ? `รูปที่ ${idx + 2}` : `+ เพิ่มรูปที่ ${idx + 2}`}
                        >
                          {editAdditionalImages[idx] ? (
                            <img src={editAdditionalImages[idx]!} alt={`extra-${idx}`} />
                          ) : (
                            <span className="ecom-thumb-plus">+</span>
                          )}
                        </button>
                      ))}
                    </div>

                    <div className="ecom-card-identity">
                      <span className="ecom-category-tag">{editCategory}</span>
                      <h2 className="ecom-card-name">{editName || 'ไม่มีชื่อการ์ด'}</h2>
                      <span className="ecom-ref-tag">ID: #{editRefId}</span>
                    </div>
                  </div>
                )
              })()}

              {/* RIGHT: Form Fields */}
              <div className="ecom-form-panel">
                <div className="ecom-form-scrollable">
                  <div className="ecom-form-heading">
                    <h3>ข้อมูลการ์ด</h3>
                  </div>

                  <div className="modal-form-group">
                    <label>ชื่อการ์ด *</label>
                    <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} required />
                  </div>

                  <div className="modal-form-row">
                    <div className="modal-form-group">
                      <label>ประเภทการ์ด/เกม</label>
                      <select value={editCategory} onChange={(e) => setEditCategory(e.target.value as Card['category'])}>
                        <option value="One Piece">One Piece</option>
                      </select>
                    </div>
                    <div className="modal-form-group">
                      <label>เลขการ์ด / รหัสอ้างอิง *</label>
                      <input type="text" value={editRefId} onChange={(e) => setEditRefId(e.target.value)} required />
                    </div>
                  </div>

                  <div className="modal-form-row">
                    <div className="modal-form-group">
                      <label>สถานะการเกรด</label>
                      <select value={editGrading} onChange={(e) => setEditGrading(e.target.value)}>
                        <optgroup label="PSA Grades">
                          <option value="PSA 10 Gem Mint">PSA 10 Gem Mint</option>
                          <option value="PSA 9 Mint">PSA 9 Mint</option>
                          <option value="PSA 8 Near Mint-Mint">PSA 8 Near Mint-Mint</option>
                          <option value="PSA 7 Near Mint">PSA 7 Near Mint</option>
                          <option value="PSA 6 Excellent-Mint">PSA 6 Excellent-Mint</option>
                          <option value="PSA 5 Excellent">PSA 5 Excellent</option>
                          <option value="PSA 4 Very Good-Excellent">PSA 4 Very Good-Excellent</option>
                          <option value="PSA 3 Very Good">PSA 3 Very Good</option>
                          <option value="PSA 2 Good">PSA 2 Good</option>
                          <option value="PSA 1 Poor">PSA 1 Poor</option>
                        </optgroup>
                        <optgroup label="BGS Grades">
                          <option value="BGS 10 Black Label">BGS 10 Black Label</option>
                          <option value="BGS 10 Pristine">BGS 10 Pristine</option>
                          <option value="BGS 9.5 Gem Mint">BGS 9.5 Gem Mint</option>
                          <option value="BGS 9 Mint">BGS 9 Mint</option>
                          <option value="BGS 8.5 NM-Mint+">BGS 8.5 NM-Mint+</option>
                          <option value="BGS 8 Near Mint">BGS 8 Near Mint</option>
                          <option value="BGS 7.5 Excellent-Mint+">BGS 7.5 Excellent-Mint+</option>
                          <option value="BGS 7 Excellent">BGS 7 Excellent</option>
                        </optgroup>
                        <optgroup label="CGC Grades">
                          <option value="CGC 10 Pristine">CGC 10 Pristine</option>
                          <option value="CGC 9.5 Gem Mint">CGC 9.5 Gem Mint</option>
                          <option value="CGC 9 Mint">CGC 9 Mint</option>
                          <option value="CGC 8.5 NM-Mint+">CGC 8.5 NM-Mint+</option>
                          <option value="CGC 8 Near Mint">CGC 8 Near Mint</option>
                        </optgroup>
                        <optgroup label="Raw / Ungraded">
                          <option value="Raw (Near Mint or Better)">Raw (Near Mint or Better)</option>
                          <option value="Raw (Excellent)">Raw (Excellent)</option>
                          <option value="Raw (Played)">Raw (Played)</option>
                          <option value="Raw (Poor)">Raw (Poor)</option>
                        </optgroup>
                      </select>
                    </div>
                    <div className="modal-form-group">
                      <label>ต้นทุนที่ซื้อมา (฿)</label>
                      <div className="input-with-currency">
                        <span>฿</span>
                        <input type="number" value={editCost || ''} onChange={(e) => setEditCost(Number(e.target.value))} />
                      </div>
                    </div>
                  </div>

                  <div className="modal-form-group">
                    <label>รายละเอียดเพิ่มเติม / สภาพการ์ด</label>
                    <textarea
                      placeholder="ระบุตำหนิการ์ด สภาพ หรือข้อมูลประวัติการซื้อขายเพิ่มเติม..."
                      value={editDetails}
                      onChange={(e) => setEditDetails(e.target.value)}
                      rows={3}
                    />
                  </div>

                  {/* Sold fields section */}
                  {editStatus === 'sold' && (
                    <div className="edit-sold-fields-section fade-in" style={{ background: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div className="modal-form-group">
                        <label>ราคาที่ขายได้ (รายรับรวม)</label>
                        <div className="input-with-currency">
                          <span>฿</span>
                          <input type="number" value={editSalePrice || ''} onChange={(e) => setEditSalePrice(Number(e.target.value))} />
                        </div>
                      </div>
                      <div className="modal-form-row">
                        <div className="modal-form-group">
                          <label>ประเภทการจัดส่ง</label>
                          <select value={editShippingType} onChange={(e) => {
                            const type = e.target.value as 'pickup' | 'shipping' | '';
                            setEditShippingType(type);
                            if (type === 'pickup' || type === '') setEditShippingCharged(0);
                          }}>
                            <option value="">เลือกการจัดส่ง</option>
                            <option value="shipping">ขนส่ง</option>
                            <option value="pickup">นัดรับ</option>
                          </select>
                        </div>
                        <div className="modal-form-group">
                          <label>ค่าส่ง</label>
                          <div className="input-with-currency">
                            <span>฿</span>
                            <input type="number" value={editShippingCharged || ''} onChange={(e) => setEditShippingCharged(Number(e.target.value))} disabled={editShippingType === 'pickup' || editShippingType === ''} />
                          </div>
                        </div>
                      </div>
                      <div className="modal-form-group">
                        <label>หมายเลขติดตามพัสดุ</label>
                        <div className={`input-with-icon ${editShippingType === 'pickup' ? 'disabled' : ''}`}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                            <rect x="1" y="3" width="15" height="13" />
                            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                            <circle cx="5.5" cy="18.5" r="2.5" />
                            <circle cx="18.5" cy="18.5" r="2.5" />
                          </svg>
                          <input type="text" placeholder={editShippingType === 'pickup' ? "ไม่ต้องใช้สำหรับนัดรับ" : "เช่น e.g., 1Z9999W99999999999"} value={editTrackingNumber} onChange={(e) => setEditTrackingNumber(e.target.value)} disabled={editShippingType === 'pickup'} />
                        </div>
                      </div>
                      <div className="modal-form-group">
                        <label>หมายเหตุรายการขาย</label>
                        <textarea placeholder="ช่องทางขาย รายละเอียดการชำระเงิน..." value={editSaleNotes} onChange={(e) => setEditSaleNotes(e.target.value)} rows={2} />
                      </div>
                    </div>
                  )}

                  {/* Delete Confirmation */}
                  {isDeleteConfirmOpen && (
                    <div className="delete-confirm-panel fade-in">
                      <div className="alert-message">
                        <strong>⚠️ ยืนยันการลบการ์ดอย่างถาวร</strong>
                        <p>กรุณากรอกรหัสยืนยันในช่องด้านล่างเพื่อลบข้อมูลการ์ดออกจากระบบอย่างถาวร</p>
                      </div>
                      <div className="delete-input-row">
                        <input type="text" placeholder="กรอกรหัสยืนยัน..." value={deleteConfirmText} onChange={(e) => setDeleteConfirmText(e.target.value)} className="delete-confirm-input" />
                        <div className="delete-confirm-actions">
                          <button type="button" className="btn-cancel-delete" onClick={() => { setIsDeleteConfirmOpen(false); setDeleteConfirmText('') }}>ยกเลิก</button>
                          <button type="button" className="btn-confirm-delete" disabled={deleteConfirmText !== 'FLUKE88'} onClick={handleDeleteCard}>ยืนยันลบ</button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Actions */}
                {!isDeleteConfirmOpen && (
                  <div className="ecom-form-footer ecom-edit-footer">
                    <button type="button" className="btn-delete-trigger" onClick={() => setIsDeleteConfirmOpen(true)}>
                      🗑️ ลบการ์ดนี้
                    </button>
                    <div className="right-save-actions">
                      <button type="button" className="btn-cancel" onClick={() => setIsEditModalOpen(false)}>ยกเลิก</button>
                      <button type="submit" className="btn-submit">บันทึกการแก้ไข</button>
                    </div>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  )
}