import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { ArrowLeft, UserPlus, Save } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { useLanguage } from './language-context';

export interface FamilyMember {
  id: string;
  name: string;
  gender: 'male' | 'female';
  age: number;
  relationship: string;
  emoji: string;
  bloodGroup: string;
  showPregnancy: boolean;
}

interface AddMemberProps {
  onBack: () => void;
  onMemberAdded: (member: FamilyMember) => void;
}

export function AddMember({ onBack, onMemberAdded }: AddMemberProps) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    gender: '' as 'male' | 'female' | '',
    age: '',
    relationship: '',
    bloodGroup: '',
    wantsPregnancyCare: false
  });

  const relationships = [
    { value: 'spouse', label: t('spouse') || 'Spouse', maleEmoji: '👨', femaleEmoji: '👩' },
    { value: 'child', label: t('child') || 'Child', maleEmoji: '👦', femaleEmoji: '👧' },
    { value: 'parent', label: t('parent') || 'Parent', maleEmoji: '👨', femaleEmoji: '👩' },
    { value: 'sibling', label: t('sibling') || 'Sibling', maleEmoji: '👨', femaleEmoji: '👩' },
    { value: 'grandparent', label: t('grandparent') || 'Grandparent', maleEmoji: '👴', femaleEmoji: '👵' },
    { value: 'other', label: t('otherFamilyMember') || 'Other Family Member', maleEmoji: '👨', femaleEmoji: '👩' }
  ];

  const bloodGroups = [
    { value: 'A+', label: 'A+' },
    { value: 'A-', label: 'A-' },
    { value: 'B+', label: 'B+' },
    { value: 'B-', label: 'B-' },
    { value: 'AB+', label: 'AB+' },
    { value: 'AB-', label: 'AB-' },
    { value: 'O+', label: 'O+' },
    { value: 'O-', label: 'O-' },
    { value: 'unknown', label: t('unknown') || 'Unknown' }
  ];

  
  const isPregnancyEligible = formData.gender === 'female' && 
                              formData.age && 
                              parseInt(formData.age) >= 15 && 
                              parseInt(formData.age) <= 50;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.gender || !formData.age || !formData.relationship || !formData.bloodGroup) {
      toast.error(t('fillAllFields') || 'Please fill in all fields');
      return;
    }

    const age = parseInt(formData.age);
    if (isNaN(age) || age < 0 || age > 120) {
      toast.error(t('validAgeRequired') || 'Please enter a valid age');
      return;
    }

    const relationship = relationships.find(r => r.value === formData.relationship);
    const emoji = formData.gender === 'male' ? relationship?.maleEmoji || '👨' : relationship?.femaleEmoji || '👩';
    
    
    
    const showPregnancy = isPregnancyEligible && formData.wantsPregnancyCare;

    const newMember: FamilyMember = {
      id: `member-${Date.now()}`,
      name: formData.name,
      gender: formData.gender,
      age,
      relationship: formData.relationship,
      emoji,
      bloodGroup: formData.bloodGroup,
      showPregnancy
    };

    
    const existingMembers = JSON.parse(localStorage.getItem('familyMembers') || '[]');
    const updatedMembers = [...existingMembers, newMember];
    localStorage.setItem('familyMembers', JSON.stringify(updatedMembers));

    onMemberAdded(newMember);
    toast.success(`${formData.name} ${t('familyMemberAdded') || 'has been added to your family!'}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      {}
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('back') || 'Back'}</span>
        </Button>
        <h1 className="text-xl font-bold text-gray-800">{t('addFamilyMember') || 'Add Family Member'}</h1>
        <div className="w-20"></div> {}
      </div>

      <div className="max-w-md mx-auto">
        <Card className="p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
              <UserPlus className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">{t('addNewMember') || 'Add New Member'}</h2>
            <p className="text-sm text-gray-600">{t('addMemberDesc') || 'Add a family member to manage their healthcare'}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {}
            <div>
              <Label htmlFor="name">{t('fullName') || 'Full Name'}</Label>
              <Input
                id="name"
                type="text"
                placeholder={t('enterFullName') || 'Enter full name'}
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="mt-1"
              />
            </div>

            {}
            <div>
              <Label htmlFor="gender">{t('gender') || 'Gender'}</Label>
              <Select 
                value={formData.gender} 
                onValueChange={(value: 'male' | 'female') => setFormData(prev => ({ ...prev, gender: value, wantsPregnancyCare: false }))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder={t('selectGender') || 'Select gender'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">👨 {t('male') || 'Male'}</SelectItem>
                  <SelectItem value="female">👩 {t('female') || 'Female'}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {}
            <div>
              <Label htmlFor="age">{t('age') || 'Age'}</Label>
              <Input
                id="age"
                type="number"
                placeholder={t('enterAge') || 'Enter age'}
                value={formData.age}
                onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value, wantsPregnancyCare: false }))}
                className="mt-1"
                min="0"
                max="120"
              />
            </div>

            {}
            <div>
              <Label htmlFor="relationship">{t('relationship') || 'Relationship'}</Label>
              <Select 
                value={formData.relationship} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, relationship: value }))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder={t('selectRelationship') || 'Select relationship'} />
                </SelectTrigger>
                <SelectContent>
                  {relationships.map((rel) => (
                    <SelectItem key={rel.value} value={rel.value}>
                      {formData.gender === 'male' ? rel.maleEmoji : rel.femaleEmoji} {rel.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {}
            <div>
              <Label htmlFor="bloodGroup">{t('bloodGroup') || 'Blood Group'}</Label>
              <Select 
                value={formData.bloodGroup} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, bloodGroup: value }))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder={t('selectBloodGroup') || 'Select blood group'} />
                </SelectTrigger>
                <SelectContent>
                  {bloodGroups.map((bg) => (
                    <SelectItem key={bg.value} value={bg.value}>
                      🩸 {bg.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {}
            {isPregnancyEligible && (
              <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="pregnancyCare"
                    checked={formData.wantsPregnancyCare}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, wantsPregnancyCare: !!checked }))}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <Label htmlFor="pregnancyCare" className="text-pink-800 cursor-pointer">
                      <div className="flex items-center space-x-2">
                        <span>🤰</span>
                        <span className="font-medium">{t('enablePregnancyCare') || 'Enable Pregnancy Care'}</span>
                      </div>
                    </Label>
                    <p className="text-xs text-pink-700 mt-1">
                      {t('pregnancyCareDesc') || 'Access specialized pregnancy features including prenatal checkups, diet plans, exercise recommendations, and pregnancy tracking.'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {}
            {formData.name && formData.gender && formData.relationship && formData.bloodGroup && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">
                    {formData.gender === 'male' 
                      ? relationships.find(r => r.value === formData.relationship)?.maleEmoji || '👨'
                      : relationships.find(r => r.value === formData.relationship)?.femaleEmoji || '👩'
                    }
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">{formData.name}</div>
                    <div className="text-sm text-gray-600">
                      {formData.age && `${formData.age} ${t('yearsOld') || 'years old'} • `}
                      {relationships.find(r => r.value === formData.relationship)?.label}
                    </div>
                    <div className="text-sm text-gray-600">
                      🩸 {t('bloodGroup') || 'Blood Group'}: {formData.bloodGroup}
                      {isPregnancyEligible && formData.wantsPregnancyCare && (
                        <span className="ml-2 text-pink-600">• 🤰 {t('pregnancyCare') || 'Pregnancy Care'}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <Button type="submit" className="w-full">
              <Save className="w-4 h-4 mr-2" />
              {t('addFamilyMember') || 'Add Family Member'}
            </Button>
          </form>
        </Card>

        <div className="mt-6 text-center text-xs text-gray-500">
          <p>{t('familyMembersSavedLocally') || 'Family members will be saved locally on this device'}</p>
        </div>
      </div>
    </div>
  );
}