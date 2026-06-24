import { useState, useMemo, useEffect } from 'react'
import './Private.css'

interface Card {
  id: string;
  name: string;
  category: 'Pokรฉmon' | 'One Piece' | 'Yu-Gi-Oh!' | 'Magic: The Gathering';
  refId: string;
  grading: string; // e.g. "PSA 10", "BGS 9.5", "Raw"
  cost: number;
  status: 'available' | 'sold';
  image?: string;
  salePrice?: number;
  shippingType?: 'pickup' | 'shipping';
  shippingCharged?: number;
  trackingNumber?: string;
  notes?: string;
  dateAdded: string;
  dateSold?: string;
  details?: string;
}

const INITIAL_CARDS: Card[] = [
  {
    id: '1',
    name: 'Roronoa Zoro (Manga Alt Art OP-01)',
    category: 'One Piece',
    refId: 'OP-042',
    grading: 'PSA 10',
    cost: 45000,
    status: 'available',
    image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&q=80',
    dateAdded: '2026-06-10',
    details: 'เนเธฃเนเธฃเนเธเธญเธฒ เนเธเนเธฅ เธกเธฑเธเธเธฐ Alt Art เธเธญเธเธกเธธเธกเน€เธเธตเธขเธเธเธฃเธดเธ เนเธฃเนเธฃเธญเธขเธ•เธณเธซเธเธด เธชเธ เธฒเธเธชเธกเธเธนเธฃเธ“เนเนเธเธ',
  },
  {
    id: '2',
    name: 'Monkey D. Luffy (Gear 5 Manga Alt OP-05)',
    category: 'One Piece',
    refId: 'OP-105',
    grading: 'BGS 9.5',
    cost: 92000,
    status: 'available',
    image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&q=80',
    dateAdded: '2026-06-12',
    details: 'เธฅเธนเธเธตเนเน€เธเธตเธขเธฃเน 5 เธฃเนเธฒเธเธกเธฑเธเธเธฐเธชเธธเธ”เนเธฃเธฃเน เธ”เธตเนเธเธเนเธชเธงเธขเธเธฒเธกเธฃเธฐเธ”เธฑเธเธ—เนเธญเธ เธเธญเธเน€เธเธตเธขเธเธ•เธฒ เธเนเธฒเธชเธฐเธชเธก',
  },
  {
    id: '3',
    name: 'Portgas D. Ace (Manga Alt Art OP-02)',
    category: 'One Piece',
    refId: 'OP-088',
    grading: 'PSA 9',
    cost: 28000,
    status: 'sold',
    salePrice: 35000,
    shippingType: 'shipping',
    shippingCharged: 350,
    notes: 'เธเธฒเธขเนเธซเนเธฅเธนเธเธเนเธฒเนเธเน€เธเธ Facebook One Piece Thailand',
    image: 'https://images.unsplash.com/photo-1541562232579-512a21360020?w=400&q=80',
    dateAdded: '2026-06-01',
    dateSold: '2026-06-20',
    details: 'เน€เธญเธช เธกเธฑเธเธเธฐ Alt Art เธชเธ เธฒเธเน€เธเนเธเธชเธฐเธชเธกเธญเธขเนเธฒเธเธ”เธต เธเธญเธเธเธกเธชเธงเธขเธเธฒเธก เนเธฃเนเธ•เธณเธซเธเธดเนเธ”เน',
  },
  {
    id: '4',
    name: 'Shanks (Manga Alt Art Super Rare OP-01)',
    category: 'One Piece',
    refId: 'OP-001',
    grading: 'PSA 10',
    cost: 380000,
    status: 'available',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&q=80',
    dateAdded: '2026-05-25',
    details: 'เนเธเธเธเธนเธช เธกเธฑเธเธเธฐเนเธฃเธฃเนเธฃเธฐเธ”เธฑเธเธ•เธณเธเธฒเธ เธชเธ เธฒเธเน€เธเธฃเธ” PSA 10 เธชเธกเธเธนเธฃเธ“เนเนเธเธ 100% เนเธฃเนเธฃเธญเธขเธเธเนเธกเธง',
  },
  {
    id: '5',
    name: 'Uta (Leader Alt Art Signature OP-02)',
    category: 'One Piece',
    refId: 'OP-124',
    grading: 'PSA 10',
    cost: 180000,
    status: 'available',
    image: 'https://images.unsplash.com/photo-1608889175123-8ee362201f81?w=400&q=80',
    dateAdded: '2026-06-15',
    details: 'เธญเธนเธ•เธฐ Leader เธฅเธฒเธขเน€เธเนเธเธชเธตเธ—เธญเธเธชเธงเธขเน€เธ”เนเธ เธเธญเธเธชเธกเธเธนเธฃเธ“เนเธฃเธฐเธ”เธฑเธเธชเธฐเธชเธกเน€เธเธฃเธ” 10 เธ—เธฃเธเธเธธเธ“เธเนเธฒ',
  },
  {
    id: '6',
    name: 'Charizard Holo (Base Set 1999)',
    category: 'Pokรฉmon',
    refId: 'PK-001',
    grading: 'PSA 10',
    cost: 450000,
    status: 'available',
    image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&q=80',
    dateAdded: '2026-06-03',
    details: 'เธฅเธดเธเธฒเธฃเนเธ”เธญเธ เธเธฅเธฒเธชเธชเธดเธเนเธฎเนเธฅเธเธต 1999 เธ•เธณเธเธฒเธเธเธฒเธฃเนเธ”เนเธเน€เธเธกเธญเธเนเธฃเธฃเนเธชเธนเธเธชเธธเธ” เธชเธ เธฒเธเน€เธเธฃเธ” 10',
  },
  {
    id: '7',
    name: 'Blue-Eyes White Dragon (1st Edition 2002)',
    category: 'Yu-Gi-Oh!',
    refId: 'YG-002',
    grading: 'PSA 9',
    cost: 290000,
    status: 'sold',
    salePrice: 420000,
    shippingType: 'shipping',
    shippingCharged: 500,
    notes: 'เธชเนเธเธ•เนเธญเนเธซเนเธเธนเนเธชเธฐเธชเธกเธเธฒเธงเธเธตเนเธเธธเนเธเธ—เธฒเธ Ebay',
    image: 'https://images.unsplash.com/photo-1541562232579-512a21360020?w=400&q=80',
    dateAdded: '2026-05-20',
    dateSold: '2026-06-18',
    details: 'เธเธฅเธนเธญเธฒเธขเธชเนเนเธงเธ—เนเธ”เธฃเธฒเธเนเธญเธเธเธฒเธฃเนเธ” 1st Edition เธเธต 2002 เธเธฒเธฃเนเธ”เนเธ—เนเธ—เธฃเธเธเธธเธ“เธเนเธฒเน€เธเธฃเธ”เธชเธฐเธชเธก 9',
  }
];

export default function Private() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'inventory' | 'add-card'>('dashboard')
  const [cards, setCards] = useState<Card[]>(() => {
    const saved = localStorage.getItem('cardvault_cards')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        console.error(e)
      }
    }
    return INITIAL_CARDS
  })

  useEffect(() => {
    localStorage.setItem('cardvault_cards', JSON.stringify(cards))
  }, [cards])

  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('All')
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'sold'>('all')

  // Form State for Add Card (Removed estimatedValue input)
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

  // Sale Modal State
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false)
  const [selectedCardForSale, setSelectedCardForSale] = useState<Card | null>(null)
  const [salePrice, setSalePrice] = useState(0)
  const [shippingType, setShippingType] = useState<'pickup' | 'shipping' | ''>('')
  const [shippingCharged, setShippingCharged] = useState(0)
  const [trackingNumber, setTrackingNumber] = useState('')
  const [saleNotes, setSaleNotes] = useState('')

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedCardForEdit, setSelectedCardForEdit] = useState<Card | null>(null)
  
  const [editName, setEditName] = useState('')
  const [editCategory, setEditCategory] = useState<Card['category']>('One Piece')
  const [editRefId, setEditRefId] = useState('')
  const [editGrading, setEditGrading] = useState('')
  const [editCost, setEditCost] = useState(0)
  const [editImage, setEditImage] = useState('')
  const [editDetails, setEditDetails] = useState('')
  
  const [editStatus, setEditStatus] = useState<'available' | 'sold'>('available')
  const [editSalePrice, setEditSalePrice] = useState(0)
  const [editShippingType, setEditShippingType] = useState<'pickup' | 'shipping' | ''>('')
  const [editShippingCharged, setEditShippingCharged] = useState(0)
  const [editTrackingNumber, setEditTrackingNumber] = useState('')
  const [editSaleNotes, setEditSaleNotes] = useState('')
  
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')

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

  // Dashboard Stats Calculations (Thai Baht) - Using cost for available value calculation
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
    const dataPoints = [{ profit: 0, date: 'เน€เธฃเธดเนเธกเธ•เนเธ' }];
    
    if (soldCards.length === 0) {
      dataPoints.push({ profit: 0, date: 'เธเธฑเธเธเธธเธเธฑเธ' });
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

  // Filtered Cards for Catalog (Only Category Filter 'All' & 'One Piece')
  const filteredCards = useMemo(() => {
    return cards.filter(card => {
      const matchesSearch = card.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            card.refId.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = categoryFilter === 'All' || card.category === categoryFilter
      const matchesStatus = statusFilter === 'all' || card.status === statusFilter
      return matchesSearch && matchesCategory && matchesStatus
    })
  }, [cards, searchQuery, categoryFilter, statusFilter])

  // Format currency (Baht เธฟ)
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(val)
  }

  // Shorten large numbers (e.g. เธฟ1.24M)
  const formatShortCurrency = (val: number) => {
    if (val >= 1000000) {
      return `เธฟ${(val / 1000000).toFixed(2)}M`
    } else if (val >= 1000) {
      return `เธฟ${(val / 1000).toFixed(1)}K`
    }
    return formatCurrency(val)
  }

  // Handle Add Card Submit
  const handleAddCardSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCard.name || !newCard.refId) {
      showToast('เธเธฃเธธเธ“เธฒเธเธฃเธญเธเธเนเธญเธกเธนเธฅเธ—เธตเนเธเธณเน€เธเนเธเนเธซเนเธเธฃเธเธ–เนเธงเธ', 'info')
      return
    }

    const cardCost = Number(newCard.cost) || 0
    const cardToAdd: Card = {
      id: Date.now().toString(),
      name: newCard.name,
      category: newCard.category as Card['category'],
      refId: newCard.refId,
      grading: newCard.grading || 'Raw',
      cost: cardCost,
      status: 'available',
      image: uploadPreview || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80',
      dateAdded: new Date().toISOString().split('T')[0],
      details: newCard.details || '',
    }

    setCards(prev => [cardToAdd, ...prev])
    showToast(`เน€เธเธดเนเธกเธเธฒเธฃเนเธ” "${cardToAdd.name}" เน€เธเนเธฒเธเธฅเธฑเธเนเธฅเนเธง`)
    
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
    setIsSaleModalOpen(true)
  }

  // Confirm Sale
  const handleConfirmSale = () => {
    if (!selectedCardForSale || !shippingType || salePrice <= 0) return

    setCards(prev => prev.map(c => {
      if (c.id === selectedCardForSale.id) {
        return {
          ...c,
          status: 'sold',
          salePrice,
          shippingType: shippingType as 'pickup' | 'shipping',
          shippingCharged: shippingType === 'shipping' ? shippingCharged : 0,
          trackingNumber: shippingType === 'shipping' ? trackingNumber : '',
          notes: saleNotes,
          dateSold: new Date().toISOString().split('T')[0]
        }
      }
      return c
    }))

    showToast(`เธเธฑเธเธ—เธถเธเธเธฒเธฃเธเธฒเธขเธเธฒเธฃเนเธ” "${selectedCardForSale.name}" เธชเธณเน€เธฃเนเธ!`)
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
    setEditDetails(card.details || '')
    setEditStatus(card.status)
    setEditSalePrice(card.salePrice || 0)
    setEditShippingType(card.shippingType || '')
    setEditShippingCharged(card.shippingCharged || 0)
    setEditTrackingNumber(card.trackingNumber || '')
    setEditSaleNotes(card.notes || '')
    
    setIsDeleteConfirmOpen(false)
    setDeleteConfirmText('')
    setIsEditModalOpen(true)
  }

  // Save Card Edits
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCardForEdit) return

    if (editStatus === 'sold' && (!editShippingType || editSalePrice <= 0)) {
      showToast('เธเธฃเธธเธ“เธฒเธเธฃเธญเธเธฃเธฒเธเธฒเธเธฒเธขเนเธฅเธฐเน€เธฅเธทเธญเธเธเธฃเธฐเน€เธ เธ—เธเธฒเธฃเธเธฑเธ”เธชเนเธเนเธซเนเธเธฃเธเธ–เนเธงเธ', 'info')
      return
    }

    setCards(prev => prev.map(c => {
      if (c.id === selectedCardForEdit.id) {
        const updatedCard: Card = {
          ...c,
          name: editName,
          category: editCategory,
          refId: editRefId,
          grading: editGrading,
          cost: Number(editCost) || 0,
          image: editImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80',
          details: editDetails,
          status: editStatus,
        }
        
        if (editStatus === 'sold') {
          updatedCard.salePrice = Number(editSalePrice) || 0
          updatedCard.shippingType = editShippingType as 'pickup' | 'shipping'
          updatedCard.shippingCharged = editShippingType === 'shipping' ? (Number(editShippingCharged) || 0) : 0
          updatedCard.trackingNumber = editShippingType === 'shipping' ? editTrackingNumber : ''
          updatedCard.notes = editSaleNotes
          if (!c.dateSold) {
            updatedCard.dateSold = new Date().toISOString().split('T')[0]
          }
        } else {
          delete updatedCard.salePrice
          delete updatedCard.shippingType
          delete updatedCard.shippingCharged
          delete updatedCard.trackingNumber
          delete updatedCard.notes
          delete updatedCard.dateSold
        }
        
        return updatedCard
      }
      return c
    }))

    showToast(`เนเธเนเนเธเธเนเธญเธกเธนเธฅเธเธฒเธฃเนเธ” "${editName}" เธชเธณเน€เธฃเนเธ!`, 'success')
    setIsEditModalOpen(false)
    setSelectedCardForEdit(null)
  }

  // Delete Card
  const handleDeleteCard = () => {
    if (!selectedCardForEdit) return
    if (deleteConfirmText !== 'FLUKE88') {
      showToast('เธเธฃเธธเธ“เธฒเธเธฃเธญเธเธฃเธซเธฑเธชเธขเธทเธเธขเธฑเธเนเธซเนเธ–เธนเธเธ•เนเธญเธ', 'info')
      return
    }

    setCards(prev => prev.filter(c => c.id !== selectedCardForEdit.id))
    showToast(`เธฅเธเธเธฒเธฃเนเธ” "${selectedCardForEdit.name}" เน€เธฃเธตเธขเธเธฃเนเธญเธขเนเธฅเนเธง`, 'success')
    setIsEditModalOpen(false)
    setSelectedCardForEdit(null)
  }

  // Handle file upload selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean = false) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      showToast('เธเธฃเธธเธ“เธฒเน€เธฅเธทเธญเธเนเธเธฅเนเธฃเธนเธเธ เธฒเธเน€เธ—เนเธฒเธเธฑเนเธ', 'info')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string
      if (isEdit) {
        setEditImage(dataUrl)
        showToast('เน€เธเธฅเธตเนเธขเธเธฃเธนเธเธ เธฒเธเธเธฒเธฃเนเธ”เธชเธณเน€เธฃเนเธ', 'success')
      } else {
        setUploadPreview(dataUrl)
        showToast('เธญเธฑเธเนเธซเธฅเธ”เธฃเธนเธเธ เธฒเธเธเธฒเธฃเนเธ”เธชเธณเน€เธฃเนเธ', 'success')
      }
    }
    reader.readAsDataURL(file)
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
            <span>เธฃเธฐเธเธเธเธฑเธเธ—เธถเธเธเธฒเธฃเนเธ”</span>
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
            เนเธ”เธเธเธญเธฃเนเธ”
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
            เธเธฅเธฑเธเธชเธดเธเธเนเธฒ
          </button>

          <button 
            className={`menu-btn ${activeTab === 'add-card' ? 'active' : ''}`}
            onClick={() => setActiveTab('add-card')}
          >
            <svg className="menu-btn__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v8M8 12h8" />
            </svg>
            เธเธฑเธเธ—เธถเธเธเธฒเธฃเนเธ”เนเธซเธกเน
          </button>

          <button 
            className="menu-btn"
            onClick={() => showToast('เธเธฑเธเธเนเธเธฑเธเธเธณเธฅเธฑเธเธเธฑเธ’เธเธฒเนเธเนเธซเธกเธ”เนเธเธฃเน€เธเธเธ•เนเธ—เธ”เธชเธญเธ', 'info')}
          >
            <svg className="menu-btn__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
            เธ•เธฑเนเธเธเนเธฒ
          </button>
        </nav>

        <div className="cv-sidebar__footer">
          <button 
            className="add-card-quick"
            onClick={() => setActiveTab('add-card')}
          >
            <span>+ เน€เธเธดเนเธกเธเธฒเธฃเนเธ”เนเธซเธกเน</span>
          </button>
          <a href="/" className="exit-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            เธญเธญเธเธซเธเนเธฒเนเธญเธ
          </a>
        </div>
      </aside>

      {/* Main Container */}
      <div className="cv-main">
        {/* Top Navbar */}
        <header className="cv-navbar">
          {/* ONLY render search container on Inventory tab. Fully removed on other pages */}
          {activeTab === 'inventory' && (
            <div className="cv-navbar__search">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <input 
                type="text" 
                placeholder="เธเนเธเธซเธฒเนเธเธเธฅเธฑเธ..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          )}

          <div className="cv-navbar__actions">
            <button className="nav-icon-btn" aria-label="Notifications" onClick={() => showToast('เนเธกเนเธกเธตเธเธฒเธฃเนเธเนเธเน€เธ•เธทเธญเธเนเธซเธกเน', 'info')}>
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

        {/* Dashboard Tab Content */}
        {activeTab === 'dashboard' && (
          <div className="cv-content fade-in">
            <div className="cv-content__header">
              <div>
                <h2>เธ เธฒเธเธฃเธงเธก</h2>
                <p>เธ•เธฑเธงเธเธตเนเธงเธฑเธ”เนเธเธเน€เธฃเธตเธขเธฅเนเธ—เธกเนเธชเธณเธซเธฃเธฑเธเธขเธญเธ”เธเธทเนเธญเธเธฒเธขเธเธญเธเธเธธเธ“</p>
              </div>
            </div>

            {/* Metrics cards grid */}
            <div className="cv-metrics-grid">
              <div className="cv-metric-card cyan">
                <div className="cv-metric-card__header">
                  <span>เธกเธนเธฅเธเนเธฒเธเธฅเธฑเธเธชเธดเธเธเนเธฒเธ—เธฑเนเธเธซเธกเธ”</span>
                  <div className="card-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <path d="M21 12H3" />
                    </svg>
                  </div>
                </div>
                <h3>{formatShortCurrency(stats.totalInventoryValue)}</h3>
                <span className="trend positive">โ–ฒ 2.4% <span className="trend-text">เน€เธ—เธตเธขเธเธเธฑเธเน€เธ”เธทเธญเธเธเนเธญเธ</span></span>
              </div>

              <div className="cv-metric-card purple">
                <div className="cv-metric-card__header">
                  <span>เธฃเธฒเธขเนเธ”เนเธฃเธงเธก</span>
                  <div className="card-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
                    </svg>
                  </div>
                </div>
                <h3>{formatShortCurrency(stats.totalRevenue)}</h3>
                <span className="trend positive">โ–ฒ 8.1% <span className="trend-text">เธ เธฒเธเธฃเธงเธกเธ—เธฑเนเธเธซเธกเธ”</span></span>
              </div>

              <div className="cv-metric-card red">
                <div className="cv-metric-card__header">
                  <span>เธ•เนเธเธ—เธธเธเธฃเธงเธก</span>
                  <div className="card-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <line x1="12" y1="20" x2="12" y2="4" />
                    </svg>
                  </div>
                </div>
                <h3>{formatShortCurrency(stats.totalCost)}</h3>
                <span className="trend negative">โ–ผ 0.5% <span className="trend-text">เธ เธฒเธเธฃเธงเธกเธ—เธฑเนเธเธซเธกเธ”</span></span>
              </div>

              <div className="cv-metric-card green">
                <div className="cv-metric-card__header">
                  <span>เธเธณเนเธฃเธชเธธเธ—เธเธด</span>
                  <div className="card-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                      <path d="M23 6l-9.5 9.5-5-5L1 18" />
                    </svg>
                  </div>
                </div>
                <h3>{formatShortCurrency(stats.netProfit)}</h3>
                <span className="trend positive">
                  โ–ฒ {stats.margin.toFixed(1)}% <span className="trend-text">เธญเธฑเธ•เธฃเธฒเธเธณเนเธฃเธชเธฐเธชเธก</span>
                </span>
              </div>
            </div>

            {/* Dashboard Visual Panels */}
            <div className="cv-panel-row">
              {/* Performance chart */}
              <div className="cv-panel cv-panel--chart">
                <div className="cv-panel__header">
                  <h4>เธเธฃเธฐเธชเธดเธ—เธเธดเธ เธฒเธเธเธฒเธฃเธ”เธณเน€เธเธดเธเธเธฒเธ (เธ•เธฅเธญเธ”เธเธฒเธฅ)</h4>
                </div>
                <div className="cv-chart-container">
                  {/* Custom animated SVG Line Chart */}
                  <svg className="spark-line-chart" viewBox="0 0 500 200">
                    <defs>
                      <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0088cc" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#0088cc" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    
                    {/* Grid Lines */}
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

                    {/* Data Points */}
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

                    {/* Y-Axis Labels */}
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
                  <h4>เธฃเธฒเธขเธเธฒเธฃเธเธฒเธขเธฅเนเธฒเธชเธธเธ”</h4>
                  <button onClick={() => {
                    setStatusFilter('sold')
                    setActiveTab('inventory')
                  }}>เธ”เธนเธ—เธฑเนเธเธซเธกเธ”</button>
                </div>
                <div className="cv-sales-list">
                  {cards.filter(c => c.status === 'sold').slice(0, 4).map(card => {
                    const profit = (card.salePrice || 0) - (card.shippingCharged || 0) - card.cost
                    return (
                      <div className="sale-item" key={card.id}>
                        <div className="sale-item__image">
                          <img src={card.image} alt={card.name} />
                        </div>
                        <div className="sale-item__details">
                          <h5>{card.name}</h5>
                          <span>{card.grading} โ€ข ID: #{card.refId}</span>
                        </div>
                        <div className="sale-item__price">
                          <strong>{formatCurrency(card.salePrice || 0)}</strong>
                          <span className="profit-indicator">โ–ฒ {formatCurrency(profit)}</span>
                        </div>
                      </div>
                    )
                  })}
                  {cards.filter(c => c.status === 'sold').length === 0 && (
                    <div className="empty-sales">
                      <p>เธขเธฑเธเนเธกเนเธกเธตเธฃเธฒเธขเธเธฒเธฃเธเธฒเธขเนเธเธฃเธฐเธเธ</p>
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
                <h2>เธเธฅเธฑเธเน€เธเนเธเธเธฒเธฃเนเธ”</h2>
                <p>เธเธฑเธ”เธเธฒเธฃเนเธฅเธฐเธ•เธดเธ”เธ•เธฒเธกเธ—เธฃเธฑเธเธขเนเธชเธดเธเธชเธฐเธชเธกเธเธญเธเธเธธเธ“</p>
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
                    {cat === 'All' ? 'เธชเธดเธเธเนเธฒเธ—เธฑเนเธเธซเธกเธ”' : cat}
                  </button>
                ))}
              </div>

              <div className="status-selector">
                <button 
                  className={`status-btn ${statusFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setStatusFilter('all')}
                >
                  เธ—เธฑเนเธเธซเธกเธ”
                </button>
                <button 
                  className={`status-btn ${statusFilter === 'available' ? 'active' : ''}`}
                  onClick={() => setStatusFilter('available')}
                >
                  เธเธฃเนเธญเธกเธเธฒเธข
                </button>
                <button 
                  className={`status-btn ${statusFilter === 'sold' ? 'active' : ''}`}
                  onClick={() => setStatusFilter('sold')}
                >
                  เธเธฒเธขเนเธฅเนเธง
                </button>
              </div>
            </div>

            {/* Cards Grid */}
            <div className="cv-cards-grid">
              {filteredCards.map(card => (
                <div className={`card-item ${card.status === 'sold' ? 'sold' : ''}`} key={card.id}>
                  <div className="card-item__image-wrap">
                    <img src={card.image} alt={card.name} loading="lazy" />
                    <span className="card-badge">{card.grading}</span>
                    {card.status === 'sold' && (
                      <div className="sold-overlay">
                        <span>๐”’ เธเธเธฃเธฒเธขเธเธฒเธฃเนเธฅเนเธง</span>
                      </div>
                    )}
                  </div>
                  <div className="card-item__body">
                    <span className="meta">BASE SET โ€ข {card.dateAdded.split('-')[0]} <span className="ref">ID: {card.refId}</span></span>
                    <h4>{card.name}</h4>
                    <p className="card-details-preview">{card.details || 'เนเธกเนเธกเธตเธฃเธฒเธขเธฅเธฐเน€เธญเธตเธขเธ”เน€เธเธดเนเธกเน€เธ•เธดเธก'}</p>
                    
                    {/* Price row: Removed Estimated Value column, keeping only Cost Price */}
                    <div className="price-row">
                      <div className="price-col">
                        <span>เธฃเธฒเธเธฒเธ—เธธเธ</span>
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
                            ๐’ธ เธเธฑเธเธ—เธถเธเธเธฒเธฃเธเธฒเธข
                          </button>
                          <button 
                            className="btn-edit-action"
                            onClick={() => openEditModal(card)}
                            title="เนเธเนเนเธเธฃเธฒเธขเธฅเธฐเน€เธญเธตเธขเธ”"
                          >
                            โ๏ธ เนเธเนเนเธ
                          </button>
                        </>
                      ) : (
                        <div className="sold-actions-row">
                          <div className="sold-details">
                            <span className="label">เธฃเธฒเธเธฒเธชเธธเธ—เธเธดเธ—เธตเนเธเธฒเธขเนเธ”เน:</span>
                            <span className="value">{formatCurrency(card.salePrice || 0)}</span>
                          </div>
                          <button 
                            className="btn-edit-action btn-edit-sold"
                            onClick={() => openEditModal(card)}
                            title="เนเธเนเนเธเธฃเธฒเธขเธฅเธฐเน€เธญเธตเธขเธ”"
                          >
                            โ๏ธ เนเธเนเนเธ
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {filteredCards.length === 0 && (
                <div className="empty-catalog">
                  <p>เนเธกเนเธเธเธฃเธฒเธขเธเธฒเธฃเธเธฒเธฃเนเธ”เธ—เธตเนเธเธธเธ“เธเธณเธฅเธฑเธเธเนเธเธซเธฒ</p>
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
                <h2>เธเธฑเธเธ—เธถเธเธเธฒเธฃเธฃเธฑเธเธ—เธฃเธฑเธเธขเนเธชเธดเธเนเธซเธกเน</h2>
                <p>เธเธฃเธญเธเธฃเธฒเธขเธฅเธฐเน€เธญเธตเธขเธ”เธ—เธตเนเธเธฃเธเธ–เนเธงเธเธชเธณเธซเธฃเธฑเธเธเธฒเธฃเนเธ”เธชเธฐเธชเธกเนเธซเธกเนเน€เธเธทเนเธญเธเธฑเธเธ—เธถเธเน€เธเนเธฒเธเธฅเธฑเธ</p>
              </div>

              <form onSubmit={handleAddCardSubmit} className="cv-form cv-form--one-frame">
                <div className="form-side-by-side">
                  {/* Left Column: Image uploader */}
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
                          <span>เธเธฅเธดเธเน€เธเธทเนเธญเน€เธเธฅเธตเนเธขเธเธฃเธนเธเธ เธฒเธ</span>
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
                        <strong>เธญเธฑเธเนเธซเธฅเธ”เธฃเธนเธเธ เธฒเธ</strong>
                        <p>เธฅเธฒเธเธงเธฒเธเธซเธฃเธทเธญเธเธฅเธดเธเน€เธเธทเนเธญเธญเธฑเธเนเธซเธฅเธ”</p>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Inputs */}
                  <div className="form-inputs-column">
                    <div className="form-group">
                      <label htmlFor="card-name">เธเธทเนเธญเธเธฒเธฃเนเธ” <span className="required">*</span></label>
                      <input 
                        id="card-name"
                        type="text" 
                        placeholder="เน€เธเนเธ เธฅเธดเธเธฒเธฃเนเธ”เธญเธ..."
                        value={newCard.name}
                        onChange={(e) => setNewCard(prev => ({ ...prev, name: e.target.value }))}
                        required
                      />
                    </div>

                    <div className="form-row-group">
                      <div className="form-group">
                        <label htmlFor="card-category">เธเธฃเธฐเน€เธ เธ—เธเธฒเธฃเนเธ”/เน€เธเธก</label>
                        <select 
                          id="card-category"
                          value={newCard.category}
                          onChange={(e) => setNewCard(prev => ({ ...prev, category: e.target.value as Card['category'] }))}
                        >
                          <option value="One Piece">One Piece</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label htmlFor="card-ref">เน€เธฅเธเธเธฒเธฃเนเธ” / เธฃเธซเธฑเธชเธญเนเธฒเธเธญเธดเธ <span className="required">*</span></label>
                        <input 
                          id="card-ref"
                          type="text" 
                          placeholder="เน€เธเนเธ e.g., 4/102"
                          value={newCard.refId}
                          onChange={(e) => setNewCard(prev => ({ ...prev, refId: e.target.value }))}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-row-group">
                      <div className="form-group">
                        <label htmlFor="card-grade">เธชเธ–เธฒเธเธฐเธเธฒเธฃเน€เธเธฃเธ”เนเธฅเธฐเธชเธ เธฒเธเธเธฒเธฃเนเธ”</label>
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
                        <label htmlFor="card-cost">เธ•เนเธเธ—เธธเธเธ—เธตเนเธเธทเนเธญเธกเธฒ (เธฟ)</label>
                        <input 
                          id="card-cost"
                          type="number" 
                          placeholder="เธฟ 0"
                          value={newCard.cost || ''}
                          onChange={(e) => setNewCard(prev => ({ ...prev, cost: Number(e.target.value) }))}
                        />
                      </div>
                    </div>

                    <div className="form-group" style={{ marginTop: '8px' }}>
                      <label htmlFor="card-details">เธฃเธฒเธขเธฅเธฐเน€เธญเธตเธขเธ”เน€เธเธดเนเธกเน€เธ•เธดเธก / เธชเธ เธฒเธเธเธฒเธฃเนเธ”</label>
                      <textarea 
                        id="card-details"
                        placeholder="เธฃเธฐเธเธธเธ•เธณเธซเธเธดเธเธฒเธฃเนเธ” เธชเธ เธฒเธเธฃเธญเธขเธเธตเธ”เธเนเธงเธ เธกเธธเธก เธซเธฃเธทเธญเธเนเธญเธกเธนเธฅเธเธฒเธฃเธเธทเนเธญเน€เธเธดเนเธกเน€เธ•เธดเธกเนเธ”เนเธ—เธตเนเธเธตเน..."
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
                    เธขเธเน€เธฅเธดเธ
                  </button>
                  <button type="submit" className="btn-submit">
                    เน€เธเธดเนเธกเธฅเธเธเธฅเธฑเธเธชเธดเธเธเนเธฒ
                  </button>
                </div>
              </form>

              <div className="form-footer-note text-center">
                <span>CardVault Pro Institutional Trading System v2.4.1</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sale Modal / Side Drawer */}
      {isSaleModalOpen && selectedCardForSale && (
        <div className="sale-modal-overlay" onClick={() => setIsSaleModalOpen(false)}>
          <div className="sale-modal-content" onClick={(e) => e.stopPropagation()}>
            <header className="sale-modal-header">
              <div className="modal-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
                <span>เธฃเธฒเธขเธฅเธฐเน€เธญเธตเธขเธ”เธ—เธฃเธฑเธเธขเนเธชเธดเธ</span>
              </div>
              <button className="close-btn" onClick={() => setIsSaleModalOpen(false)} aria-label="Close modal">ร—</button>
            </header>

            <div className="sale-modal-body">
              {/* Left Column: Card Details preview (Removed estimated market value) */}
              <div className="sale-card-details">
                <div className="card-preview-image">
                  <img src={selectedCardForSale.image} alt={selectedCardForSale.name} />
                  <span className="preview-badge">{selectedCardForSale.grading}</span>
                </div>
                <div className="card-preview-info">
                  <span className="category-kicker">BASE SET โ€ข 1ST EDITION</span>
                  <h3>{selectedCardForSale.name}</h3>
                  <span className="ref-id">ID: #{selectedCardForSale.refId}</span>

                  <div className="prices-grid">
                    <div className="price-block">
                      <span>เธ•เนเธเธ—เธธเธเธ—เธตเนเธเธทเนเธญ</span>
                      <strong>{formatCurrency(selectedCardForSale.cost)}</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Sale Record Form */}
              <div className="sale-record-form">
                <h4>เธเธฑเธเธ—เธถเธเธเธฒเธฃเธเธฒเธข</h4>
                <p>เธ—เธณเธฃเธฒเธขเธเธฒเธฃเธเธทเนเธญเธเธฒเธขเนเธฅเธฐเธญเธฑเธเน€เธ”เธ•เธเธฑเธเธเธตเธฃเธฒเธขเธเธทเนเธญเธเธฒเธฃเนเธ”</p>

                <div className="modal-form-group">
                  <label>เธฃเธฒเธเธฒเธ—เธตเนเธเธฒเธขเนเธ”เน (เธฃเธฒเธขเธฃเธฑเธเธฃเธงเธก)</label>
                  <div className="input-with-currency">
                    <span>เธฟ</span>
                    <input 
                      type="number" 
                      value={salePrice || ''}
                      onChange={(e) => setSalePrice(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="modal-form-row">
                  {/* Replaced Cost of Shipping input with Shipping Type dropdown */}
                  <div className="modal-form-group">
                    <label>เธเธฃเธฐเน€เธ เธ—เธเธฒเธฃเธเธฑเธ”เธชเนเธ</label>
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
                      <option value="">เน€เธฅเธทเธญเธเธเธฒเธฃเธเธฑเธ”เธชเนเธ</option>
                      <option value="shipping">เธเธเธชเนเธ</option>
                      <option value="pickup">เธเธฑเธ”เธฃเธฑเธ</option>
                    </select>
                  </div>

                  {/* Renamed "เธเนเธฒเธชเนเธเธ—เธตเนเน€เธฃเธตเธขเธเน€เธเนเธ" to "เธเนเธฒเธชเนเธ", disabled if shippingType is pickup or not selected */}
                  <div className="modal-form-group">
                    <label>เธเนเธฒเธชเนเธ</label>
                    <div className="input-with-currency">
                      <span>เธฟ</span>
                      <input 
                        type="number" 
                        value={shippingCharged || ''}
                        onChange={(e) => setShippingCharged(Number(e.target.value))}
                        disabled={shippingType === 'pickup' || shippingType === ''}
                      />
                    </div>
                  </div>
                </div>

                {/* Tracking Number input - always rendered to prevent modal layout shift when toggling delivery type */}
                <div className="modal-form-group">
                  <label>เธซเธกเธฒเธขเน€เธฅเธเธ•เธดเธ”เธ•เธฒเธกเธเธฑเธชเธ”เธธ</label>
                  <div className={`input-with-icon ${shippingType === 'pickup' ? 'disabled' : ''}`}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                      <rect x="1" y="3" width="15" height="13" />
                      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                      <circle cx="5.5" cy="18.5" r="2.5" />
                      <circle cx="18.5" cy="18.5" r="2.5" />
                    </svg>
                    <input 
                      type="text" 
                      placeholder={shippingType === 'pickup' ? "เนเธกเนเธ•เนเธญเธเนเธเนเธชเธณเธซเธฃเธฑเธเธเธฑเธ”เธฃเธฑเธ" : "เน€เธเนเธ e.g., 1Z9999W99999999999"}
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      disabled={shippingType === 'pickup'}
                    />
                  </div>
                </div>

                <div className="modal-form-group">
                  <label>เธซเธกเธฒเธขเน€เธซเธ•เธธเธฃเธฒเธขเธเธฒเธฃ</label>
                  <textarea 
                    placeholder="เธเธงเธฒเธกเธ•เนเธญเธเธเธฒเธฃเธเธญเธเธฅเธนเธเธเนเธฒ เธเนเธฒเธเธฃเธฃเธกเน€เธเธตเธขเธกเนเธเธฅเธ•เธเธญเธฃเนเธก เธฏเธฅเธฏ"
                    value={saleNotes}
                    onChange={(e) => setSaleNotes(e.target.value)}
                  />
                </div>

                {/* Profit summary card - Colored green for profit and red for loss */}
                {(() => {
                  const netProfitVal = salePrice - (shippingType === 'shipping' ? shippingCharged : 0) - selectedCardForSale.cost;
                  const isLoss = netProfitVal < 0;
                  return (
                    <div className={`sale-summary-card ${isLoss ? 'loss' : 'profit'}`}>
                      <div className="summary-row">
                        <span>เธเธณเนเธฃเธชเธธเธ—เธเธดเนเธ”เธขเธเธฃเธฐเธกเธฒเธ“</span>
                        <div className="tooltip-trigger">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="16" x2="12" y2="12" />
                            <line x1="12" y1="8" x2="12.01" y2="8" />
                          </svg>
                        </div>
                      </div>
                      <strong className="profit-value">
                        {formatCurrency(netProfitVal)}
                      </strong>
                      <span className="formula">
                        {shippingType === 'shipping' ? '(เธฃเธฒเธขเนเธ”เน - เธเนเธฒเธชเนเธ) - เธ•เนเธเธ—เธธเธ' : 'เธฃเธฒเธขเนเธ”เน - เธ•เนเธเธ—เธธเธ'}
                      </span>
                    </div>
                  );
                })()}

                <button 
                  className="confirm-sale-btn"
                  onClick={handleConfirmSale}
                  disabled={!shippingType || salePrice <= 0}
                >
                  โ“ เธขเธทเธเธขเธฑเธเธเธฒเธฃเธเธฒเธขเนเธฅเธฐเธ—เธณเน€เธเธฃเธทเนเธญเธเธซเธกเธฒเธขเธงเนเธฒเธเธฒเธขเนเธฅเนเธง
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal / Side Drawer */}
      {isEditModalOpen && selectedCardForEdit && (
        <div className="sale-modal-overlay" onClick={() => setIsEditModalOpen(false)}>
          <div className="sale-modal-content edit-modal-content" onClick={(e) => e.stopPropagation()}>
            <header className="sale-modal-header">
              <div className="modal-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                <span>เธ”เธนเนเธฅเธฐเนเธเนเนเธเธฃเธฒเธขเธฅเธฐเน€เธญเธตเธขเธ”เธเธฒเธฃเนเธ”</span>
              </div>
              <button className="close-btn" onClick={() => setIsEditModalOpen(false)} aria-label="Close modal">ร—</button>
            </header>

            <form onSubmit={handleSaveEdit} className="edit-modal-body">
              {/* Image preview & upload on Left */}
              <div className="sale-card-details">
                <input 
                  id="edit-card-file-input"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, true)}
                  style={{ display: 'none' }}
                />
                <div 
                  className="card-preview-image clickable-upload" 
                  onClick={() => document.getElementById('edit-card-file-input')?.click()}
                >
                  <img src={editImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80'} alt={editName} />
                  <span className="preview-badge">{editGrading}</span>
                  <div className="upload-hover">
                    <span>เธเธฅเธดเธเน€เธเธทเนเธญเน€เธเธฅเธตเนเธขเธเธฃเธนเธเธ เธฒเธ</span>
                  </div>
                </div>
                
                <div className="card-preview-info" style={{ borderTop: 'none', paddingTop: 0 }}>
                  <span className="category-kicker">BASE SET โ€ข 1ST EDITION</span>
                  <h3>{editName || 'เนเธกเนเธกเธตเธเธทเนเธญเธเธฒเธฃเนเธ”'}</h3>
                  <span className="ref-id">ID: #{editRefId}</span>
                </div>
              </div>

              {/* Form fields on Right */}
              <div className="sale-record-form edit-form-fields">
                <div className="edit-form-scrollable">
                  <div className="modal-form-group">
                    <label>เธเธทเนเธญเธเธฒเธฃเนเธ” *</label>
                    <input 
                      type="text" 
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="modal-form-row">
                    <div className="modal-form-group">
                      <label>เธเธฃเธฐเน€เธ เธ—เธเธฒเธฃเนเธ”/เน€เธเธก</label>
                      <select 
                        value={editCategory}
                        onChange={(e) => setEditCategory(e.target.value as Card['category'])}
                      >
                        <option value="One Piece">One Piece</option>
                      </select>
                    </div>

                    <div className="modal-form-group">
                      <label>เน€เธฅเธเธเธฒเธฃเนเธ” / เธฃเธซเธฑเธชเธญเนเธฒเธเธญเธดเธ *</label>
                      <input 
                        type="text" 
                        value={editRefId}
                        onChange={(e) => setEditRefId(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="modal-form-row">
                    <div className="modal-form-group">
                      <label>เธชเธ–เธฒเธเธฐเธเธฒเธฃเน€เธเธฃเธ”เนเธฅเธฐเธชเธ เธฒเธเธเธฒเธฃเนเธ”</label>
                      <select 
                        value={editGrading}
                        onChange={(e) => setEditGrading(e.target.value)}
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

                    <div className="modal-form-group">
                      <label>เธ•เนเธเธ—เธธเธเธ—เธตเนเธเธทเนเธญเธกเธฒ (เธฟ)</label>
                      <div className="input-with-currency">
                        <span>เธฟ</span>
                        <input 
                          type="number" 
                          value={editCost || ''}
                          onChange={(e) => setEditCost(Number(e.target.value))}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="modal-form-group">
                    <label>เธฃเธฒเธขเธฅเธฐเน€เธญเธตเธขเธ”เน€เธเธดเนเธกเน€เธ•เธดเธก / เธชเธ เธฒเธเธเธฒเธฃเนเธ”</label>
                    <textarea 
                      placeholder="เธฃเธฐเธเธธเธ•เธณเธซเธเธดเธเธฒเธฃเนเธ” เธชเธ เธฒเธ เธซเธฃเธทเธญเธเนเธญเธกเธนเธฅเธเธฃเธฐเธงเธฑเธ•เธดเธเธฒเธฃเธเธทเนเธญเธเธฒเธขเน€เธเธดเนเธกเน€เธ•เธดเธก..."
                      value={editDetails}
                      onChange={(e) => setEditDetails(e.target.value)}
                      rows={2}
                    />
                  </div>


                  {/* Conditionally show sold fields in edit modal */}
                  {editStatus === 'sold' && (
                    <div className="edit-sold-fields-section fade-in" style={{ background: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div className="modal-form-group">
                        <label>เธฃเธฒเธเธฒเธ—เธตเนเธเธฒเธขเนเธ”เน (เธฃเธฒเธขเธฃเธฑเธเธฃเธงเธก)</label>
                        <div className="input-with-currency">
                          <span>เธฟ</span>
                          <input 
                            type="number" 
                            value={editSalePrice || ''}
                            onChange={(e) => setEditSalePrice(Number(e.target.value))}
                          />
                        </div>
                      </div>
                    <div className="modal-form-row">
                        <div className="modal-form-group">
                          <label>เธเธฃเธฐเน€เธ เธ—เธเธฒเธฃเธเธฑเธ”เธชเนเธ</label>
                          <select 
                            value={editShippingType}
                            onChange={(e) => {
                              const type = e.target.value as 'pickup' | 'shipping' | '';
                              setEditShippingType(type);
                              if (type === 'pickup' || type === '') {
                                setEditShippingCharged(0);
                              }
                            }}
                          >
                            <option value="">เน€เธฅเธทเธญเธเธเธฒเธฃเธเธฑเธ”เธชเนเธ</option>
                            <option value="shipping">เธเธเธชเนเธ</option>
                            <option value="pickup">เธเธฑเธ”เธฃเธฑเธ</option>
                          </select>
                        </div>

                        <div className="modal-form-group">
                          <label>เธเนเธฒเธชเนเธ</label>
                          <div className="input-with-currency">
                            <span>เธฟ</span>
                            <input 
                              type="number" 
                              value={editShippingCharged || ''}
                              onChange={(e) => setEditShippingCharged(Number(e.target.value))}
                              disabled={editShippingType === 'pickup' || editShippingType === ''}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="modal-form-group">
                        <label>เธซเธกเธฒเธขเน€เธฅเธเธ•เธดเธ”เธ•เธฒเธกเธเธฑเธชเธ”เธธ</label>
                        <div className={`input-with-icon ${editShippingType === 'pickup' ? 'disabled' : ''}`}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                            <rect x="1" y="3" width="15" height="13" />
                            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                            <circle cx="5.5" cy="18.5" r="2.5" />
                            <circle cx="18.5" cy="18.5" r="2.5" />
                          </svg>
                          <input 
                            type="text" 
                            placeholder={editShippingType === 'pickup' ? "เนเธกเนเธ•เนเธญเธเนเธเนเธชเธณเธซเธฃเธฑเธเธเธฑเธ”เธฃเธฑเธ" : "เน€เธเนเธ e.g., 1Z9999W99999999999"}
                            value={editTrackingNumber}
                            onChange={(e) => setEditTrackingNumber(e.target.value)}
                            disabled={editShippingType === 'pickup'}
                          />
                        </div>
                      </div>

                      <div className="modal-form-group">
                        <label>เธซเธกเธฒเธขเน€เธซเธ•เธธเธฃเธฒเธขเธเธฒเธฃเธเธฒเธข</label>
                        <textarea 
                          placeholder="เธเนเธญเธเธ—เธฒเธเธเธฒเธข เธฃเธฒเธขเธฅเธฐเน€เธญเธตเธขเธ”เธเธฒเธฃเธเธณเธฃเธฐเน€เธเธดเธ..."
                          value={editSaleNotes}
                          onChange={(e) => setEditSaleNotes(e.target.value)}
                          rows={2}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Inline Delete Confirmation Panel */}
                {isDeleteConfirmOpen ? (
                  <div className="delete-confirm-panel fade-in">
                    <div className="alert-message">
                      <strong>โ ๏ธ เธขเธทเธเธขเธฑเธเธเธฒเธฃเธฅเธเธเธฒเธฃเนเธ”เธญเธขเนเธฒเธเธ–เธฒเธงเธฃ</strong>
                      <p>เธเธฃเธธเธ“เธฒเธเธฃเธญเธเธฃเธซเธฑเธชเธเนเธฒเธเธขเธทเธเธขเธฑเธเนเธเธเนเธญเธเธ”เนเธฒเธเธฅเนเธฒเธเน€เธเธทเนเธญเธฅเธเธเนเธญเธกเธนเธฅเธเธฒเธฃเนเธ”เธญเธญเธเธเธฒเธเธฃเธฐเธเธเธญเธขเนเธฒเธเธ–เธฒเธงเธฃ</p>
                    </div>
                    <div className="delete-input-row">
                      <input 
                        type="text"
                        placeholder="เธเธฃเธญเธเธฃเธซเธฑเธชเธขเธทเธเธขเธฑเธ..."
                        value={deleteConfirmText}
                        onChange={(e) => setDeleteConfirmText(e.target.value)}
                        className="delete-confirm-input"
                      />
                      <div className="delete-confirm-actions">
                        <button 
                          type="button" 
                          className="btn-cancel-delete"
                          onClick={() => {
                            setIsDeleteConfirmOpen(false)
                            setDeleteConfirmText('')
                          }}
                        >
                          เธขเธเน€เธฅเธดเธ
                        </button>
                        <button 
                          type="button"
                          className="btn-confirm-delete"
                          disabled={deleteConfirmText !== 'FLUKE88'}
                          onClick={handleDeleteCard}
                        >
                          เธขเธทเธเธขเธฑเธเธฅเธ
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="form-actions-edit">
                    <button 
                      type="button" 
                      className="btn-delete-trigger"
                      onClick={() => setIsDeleteConfirmOpen(true)}
                    >
                      ๐—‘๏ธ เธฅเธเธเธฒเธฃเนเธ”เธเธตเน
                    </button>
                    <div className="right-save-actions">
                      <button 
                        type="button" 
                        className="btn-cancel"
                        onClick={() => setIsEditModalOpen(false)}
                      >
                        เธขเธเน€เธฅเธดเธ
                      </button>
                      <button type="submit" className="btn-submit">
                        เธเธฑเธเธ—เธถเธเธเธฒเธฃเนเธเนเนเธ
                      </button>
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
