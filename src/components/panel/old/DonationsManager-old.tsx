
import React, { useState } from 'react';
import { Button } from '@/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card';
import { Input } from '@/components/input';
import { Label } from '@/components/label';
import { Textarea } from '@/components/textarea';
import { DollarSign, Edit, Save, X } from 'lucide-react';

interface DonationInfo {
  iban: string;
  bic: string;
  titular: string;
  bizum: string;
  verse: string;
  additionalMethods: string;
}

const DonationsManager = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [donationInfo, setDonationInfo] = useState<DonationInfo>(() => {
    const storedInfo = localStorage.getItem('donationInfo');
    return storedInfo ? JSON.parse(storedInfo) : {
      iban: 'ES1021001419020200597614',
      bic: 'CAIXESBBXXX',
      titular: 'Centro Cristiano Casa de Provisión',
      bizum: 'En construcción',
      verse: '"Cada uno dé como propuso en su corazón: no con tristeza, ni por necesidad, porque Dios ama al dador alegre." — 2 Corintios 9:7a',
      additionalMethods: ''
    };
  });

  const handleSave = () => {
    localStorage.setItem('donationInfo', JSON.stringify(donationInfo));
    setIsEditing(false);
  };

  const handleCancel = () => {
    const storedInfo = localStorage.getItem('donationInfo');
    if (storedInfo) {
      setDonationInfo(JSON.parse(storedInfo));
    }
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-church-blue-dark">Gestión de Donaciones</h2>
        {!isEditing ? (
          <Button
            onClick={() => setIsEditing(true)}
            className="bg-church-gold hover:bg-church-gold-dark text-white"
          >
            <Edit className="h-4 w-4 mr-2" />
            Editar Información
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              onClick={handleSave}
              className="bg-church-gold hover:bg-church-gold-dark text-white"
            >
              <Save className="h-4 w-4 mr-2" />
              Guardar
            </Button>
            <Button
              onClick={handleCancel}
              variant="outline"
            >
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-church-gold" />
            Información de Donaciones
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="iban">IBAN</Label>
              <Input
                id="iban"
                value={donationInfo.iban}
                onChange={(e) => setDonationInfo({...donationInfo, iban: e.target.value})}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bic">BIC/SWIFT</Label>
              <Input
                id="bic"
                value={donationInfo.bic}
                onChange={(e) => setDonationInfo({...donationInfo, bic: e.target.value})}
                disabled={!isEditing}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="titular">Titular</Label>
            <Input
              id="titular"
              value={donationInfo.titular}
              onChange={(e) => setDonationInfo({...donationInfo, titular: e.target.value})}
              disabled={!isEditing}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bizum">Bizum</Label>
            <Input
              id="bizum"
              value={donationInfo.bizum}
              onChange={(e) => setDonationInfo({...donationInfo, bizum: e.target.value})}
              disabled={!isEditing}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="verse">Versículo Bíblico</Label>
            <Textarea
              id="verse"
              value={donationInfo.verse}
              onChange={(e) => setDonationInfo({...donationInfo, verse: e.target.value})}
              disabled={!isEditing}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="additionalMethods">Métodos Adicionales de Donación</Label>
            <Textarea
              id="additionalMethods"
              value={donationInfo.additionalMethods}
              onChange={(e) => setDonationInfo({...donationInfo, additionalMethods: e.target.value})}
              disabled={!isEditing}
              rows={3}
              placeholder="Agregar información sobre otros métodos de donación..."
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Vista Previa Pública</CardTitle>
        </CardHeader>
        <CardContent className="bg-gray-50 p-6 rounded-lg">
          <div className="space-y-4">
            <div>
              <strong>IBAN:</strong> {donationInfo.iban}
            </div>
            <div>
              <strong>BIC/SWIFT:</strong> {donationInfo.bic}
            </div>
            <div>
              <strong>Titular:</strong> {donationInfo.titular}
            </div>
            <div>
              <strong>Bizum:</strong> {donationInfo.bizum}
            </div>
            {donationInfo.additionalMethods && (
              <div>
                <strong>Métodos Adicionales:</strong>
                <div className="mt-2 whitespace-pre-line">{donationInfo.additionalMethods}</div>
              </div>
            )}
            <div className="border-t pt-4 mt-4">
              <em className="text-church-blue-dark">{donationInfo.verse}</em>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DonationsManager;
